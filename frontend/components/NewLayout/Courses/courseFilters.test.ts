import assert from "node:assert/strict"

import { describe, it } from "node:test"

import {
  applyFilterState,
  courseMatchesSearch,
  courseMatchesTags,
  FilterableCourse,
  filterCourses,
  normalizeSearchText,
  parseFilterQuery,
  resolveActiveTagIds,
  TagsByCategory,
} from "./courseFilters"

const STATUSES = ["Active", "Upcoming", "Ended"]

const tagsByCategory: TagsByCategory = {
  language: [{ id: "fi" }, { id: "en" }, { id: "se" }],
  difficulty: [{ id: "beginner" }, { id: "advanced" }],
  module: [{ id: "programming" }, { id: "cyber" }],
}

const makeCourse = (
  overrides: Partial<FilterableCourse> & { tagIds?: Array<string> } = {},
): FilterableCourse => {
  const { tagIds = [], ...rest } = overrides
  return {
    name: "Ohjelmoinnin MOOC",
    description: "Opi ohjelmoimaan",
    status: "Active",
    tags: tagIds.map((id) => ({ id })),
    study_modules: [],
    course_translations: [
      { name: "Ohjelmoinnin MOOC", description: "Opi ohjelmoimaan" },
      { name: "Programming MOOC", description: "Learn to code" },
    ],
    ...rest,
  }
}

const filters = (overrides = {}) => ({
  search: "",
  activeTagIds: [],
  tagsByCategory,
  statuses: ["Active", "Upcoming"],
  ...overrides,
})

describe("normalizeSearchText", () => {
  it("ignores case and diacritics", () => {
    assert.equal(
      normalizeSearchText("ÄÄNESTÄJÄ Åre Ölçü"),
      "aanestaja are olcu",
    )
  })
})

describe("courseMatchesSearch", () => {
  const course = makeCourse()

  it("matches everything for a blank query", () => {
    assert.ok(courseMatchesSearch(course, "  "))
  })

  it("matches names in any translation", () => {
    assert.ok(courseMatchesSearch(course, "programming"))
    assert.ok(courseMatchesSearch(course, "OHJELMOINNIN"))
  })

  it("matches descriptions in any translation", () => {
    assert.ok(courseMatchesSearch(course, "learn to"))
  })

  it("is diacritic-insensitive", () => {
    assert.ok(courseMatchesSearch(course, "ohjelmoimaan"))
    assert.ok(courseMatchesSearch(makeCourse({ name: "Tekoäly" }), "tekoaly"))
  })

  it("requires every word to match", () => {
    assert.ok(courseMatchesSearch(course, "mooc ohjelmoimaan"))
    assert.ok(!courseMatchesSearch(course, "mooc java"))
  })
})

describe("courseMatchesTags", () => {
  const course = makeCourse({ tagIds: ["fi", "beginner", "programming"] })

  it("matches when nothing is selected", () => {
    assert.ok(courseMatchesTags(course, [], tagsByCategory))
  })

  it("ORs tags within a category", () => {
    assert.ok(courseMatchesTags(course, ["fi", "en"], tagsByCategory))
    assert.ok(!courseMatchesTags(course, ["en", "se"], tagsByCategory))
  })

  it("ANDs across categories", () => {
    assert.ok(courseMatchesTags(course, ["fi", "beginner"], tagsByCategory))
    assert.ok(!courseMatchesTags(course, ["fi", "advanced"], tagsByCategory))
  })

  it("treats a fully selected category as no restriction", () => {
    const untagged = makeCourse({ tagIds: ["programming"] })
    assert.ok(courseMatchesTags(untagged, ["fi", "en", "se"], tagsByCategory))
    assert.ok(!courseMatchesTags(untagged, ["fi", "en"], tagsByCategory))
  })

  it("keeps matching when every tag of every category is selected", () => {
    const all = Object.values(tagsByCategory)
      .flat()
      .map((tag) => tag.id)
    assert.ok(courseMatchesTags(makeCourse(), all, tagsByCategory))
  })
})

describe("filterCourses", () => {
  const fiCourse = makeCourse({ tagIds: ["fi"] })
  const enCourse = makeCourse({
    name: "Cyber Security",
    description: "Security",
    tagIds: ["en"],
    course_translations: [
      { name: "Cyber Security", description: "Security" },
      { name: "Kyberturvallisuus", description: "Tietoturva" },
    ],
  })

  it("drops hidden courses", () => {
    assert.equal(
      filterCourses([makeCourse({ hidden: true })], filters()).length,
      0,
    )
  })

  it("finds a course by its name in another language", () => {
    const result = filterCourses(
      [fiCourse, enCourse],
      filters({ search: "kyberturva" }),
    )
    assert.deepEqual(result, [enCourse])
  })

  it("filters by status and keeps courses without status", () => {
    const ended = makeCourse({ status: "Ended" })
    const unknown = makeCourse({ status: null })
    assert.deepEqual(filterCourses([ended, unknown], filters()), [unknown])
    assert.equal(
      filterCourses([ended, unknown], filters({ statuses: [] })).length,
      2,
    )
  })

  it("hides courses with modules when moduleless is set", () => {
    const withModule = makeCourse({ study_modules: [{}] })
    assert.deepEqual(
      filterCourses([withModule, fiCourse], filters({ moduleless: true })),
      [fiCourse],
    )
  })
})

describe("resolveActiveTagIds", () => {
  it("uses explicit selection, including an empty one", () => {
    assert.deepEqual(
      resolveActiveTagIds({
        explicitTagIds: [],
        defaultLanguageTagId: "fi",
        search: "",
      }),
      [],
    )
    assert.deepEqual(
      resolveActiveTagIds({
        explicitTagIds: ["en"],
        defaultLanguageTagId: "fi",
        search: "x",
      }),
      ["en"],
    )
  })

  it("falls back to the UI language tag", () => {
    assert.deepEqual(
      resolveActiveTagIds({
        explicitTagIds: null,
        defaultLanguageTagId: "fi",
        search: "",
      }),
      ["fi"],
    )
  })

  it("drops the implicit language while searching", () => {
    assert.deepEqual(
      resolveActiveTagIds({
        explicitTagIds: null,
        defaultLanguageTagId: "fi",
        search: "cyber",
      }),
      [],
    )
  })
})

describe("URL state", () => {
  it("parses defaults from an empty query", () => {
    assert.deepEqual(parseFilterQuery({}, STATUSES), {
      search: "",
      tagIds: null,
      statuses: ["Active", "Upcoming"],
    })
  })

  it("distinguishes an explicitly empty selection from none", () => {
    const parsed = parseFilterQuery({ tag: "", status: "" }, STATUSES)
    assert.deepEqual(parsed.tagIds, [])
    assert.deepEqual(parsed.statuses, [])
  })

  it("ignores unknown statuses and accepts single values", () => {
    const parsed = parseFilterQuery(
      { tag: "fi", status: ["Ended", "Bogus"], search: "a b" },
      STATUSES,
    )
    assert.deepEqual(parsed, {
      search: "a b",
      tagIds: ["fi"],
      statuses: ["Ended"],
    })
  })

  it("round-trips through applyFilterState", () => {
    for (const state of [
      { search: "100%", tagIds: ["fi", "beginner"], statuses: ["Ended"] },
      { search: "", tagIds: [], statuses: [] },
      { search: "", tagIds: null, statuses: ["Active", "Upcoming"] },
    ]) {
      assert.deepEqual(
        parseFilterQuery(applyFilterState({}, state), STATUSES),
        state,
      )
    }
  })

  it("omits defaults and keeps unrelated params", () => {
    const query = applyFilterState(
      { moduleless: "true", search: "x", tag: ["fi"] },
      { search: "", tagIds: null, statuses: ["Upcoming", "Active"] },
    )
    assert.deepEqual(query, { moduleless: "true" })
  })
})
