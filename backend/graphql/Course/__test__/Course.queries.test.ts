import { gql } from "graphql-request"
import { get, orderBy } from "lodash"

import { Course } from "@prisma/client"

import { fakeTMCCurrent, getTestContext } from "../../../tests/__helpers"
import { adminUserDetails, normalUserDetails } from "../../../tests/data"
import { seed } from "../../../tests/data/seed"

jest.mock("../../../services/kafkaProducer")

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
})

describe("Course", () => {
  describe("queries", () => {
    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    describe("course", () => {
      let createdCourses: Course[] | null = null

      beforeEach(async () => {
        createdCourses = (await seed(ctx.prisma)).courses
      })

      afterEach(() => (createdCourses = null))

      describe("normal user", () => {
        beforeEach(() =>
          ctx!.client.setHeader("Authorization", "Bearer normal"),
        )

        it("should error on no parameters", async () => {
          try {
            await ctx.client.request(courseQuery)
            fail()
          } catch {}
        })

        it("returns course on id and slug", async () => {
          const resId = await ctx.client.request(courseQuery, {
            id: createdCourses![0].id,
          })
          const resSlug = await ctx.client.request(courseQuery, {
            slug: "course1",
          })

          ;[resId, resSlug].map((res) =>
            // had sortStudyModules
            expect(res.course).toMatchSnapshot({
              id: expect.any(String),
            }),
          )
        })

        it("returns correct language", async () => {
          const res = await ctx.client.request(courseQuery, {
            slug: "course1",
            language: "en_US",
          })

          // had sortStudyModules
          expect(res.course).toMatchSnapshot({
            id: expect.any(String),
          })
        })

        it("should return null on non-existent language", async () => {
          const res = await ctx.client.request(courseQuery, {
            slug: "course1",
            language: "sv_SE",
          })

          expect(res).toEqual({ course: null })
        })

        it("should error on invalid id and slug", async () => {
          try {
            await ctx.client.request(courseQuery, {
              id: new Array(33).join("1"),
            })
            fail()
          } catch {}
          try {
            await ctx.client.request(courseQuery, {
              slug: "invalid",
            })
            fail()
          } catch {}
        })
      })

      describe("admin", () => {
        beforeEach(() => ctx!.client.setHeader("Authorization", "Bearer admin"))

        it("returns full course on id and slug", async () => {
          const resId = await ctx.client.request(fullCourseQuery, {
            id: createdCourses![0].id,
          })
          const resSlug = await ctx.client.request(fullCourseQuery, {
            slug: "course1",
          })

          ;[resId, resSlug].map((res) =>
            expect(
              applySortFns([sortExercises, sortStudyModules, sortCourseTags])(
                res.course,
              ),
            ).toMatchSnapshot({
              id: expect.any(String),
            }),
          )
        })

        it("should include deleted exercises if specified", async () => {
          const res = await ctx.client.request(fullCourseQuery, {
            slug: "course1",
            includeDeletedExercises: true,
          })

          expect(
            applySortFns([sortExercises, sortStudyModules, sortCourseTags])(
              res.course,
            ),
          ).toMatchSnapshot()
        })
      })
    })

    describe("courses", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("returns courses", async () => {
        const res = await ctx.client.request(coursesQuery)

        expect(
          orderBy(res.courses.map(sortStudyModules), ["id"]),
        ).toMatchSnapshot()
      })

      it("returns courses ordered", async () => {
        for (const order of ["asc", "desc"]) {
          const res = await ctx.client.request(coursesQuery, {
            orderBy: { name: order },
          })

          expect(res.courses.map(sortStudyModules)).toMatchSnapshot(
            `courses-order-${order}`,
          )
        }
      })

      it("returns courses filtered by language", async () => {
        for (const language of ["fi_FI", "en_US", "bogus"]) {
          const res = await ctx.client.request(coursesQuery, {
            language,
          })

          expect(
            orderBy(res.courses?.map(sortStudyModules), ["id"]),
          ).toMatchSnapshot(`courses-language-${language}`)
        }
      })

      const searchTest: Array<[string, string[]]> = [
        ["course1", ["course1"]],
        ["teacher", ["course1", "course2"]],
        ["teacher1", ["course1"]],
        ["teacher2", ["course2"]],
        ["teacher3", []],
        ["e@mail", ["course1", "course2"]],
        ["en_US", ["course1"]],
        ["se_SE", []],
      ]

      it("returns search results", async () => {
        for (const [search, expected] of searchTest) {
          const res = await ctx.client.request(coursesQuery, {
            search,
          })

          const resultSlugs = res.courses?.map((c: Course) => c.slug).sort()

          expect(resultSlugs).toEqual(expected.sort())
        }
      })

      it("filters hidden", async () => {
        for (const hidden of [true, false, null]) {
          const res = await ctx.client.request(coursesQuery, {
            hidden,
          })

          expect(res.courses?.map((c: Course) => c.id).sort()).toMatchSnapshot(
            `courses-hidden-${hidden}`,
          )
        }
      })

      it("filters handledBy", async () => {
        for (const handledBy of ["handler", "foo"]) {
          const res = await ctx.client.request(coursesQuery, {
            handledBy,
          })

          expect(res.courses?.map((c: Course) => c.id).sort()).toMatchSnapshot(
            `courses-hidden-${handledBy}`,
          )
        }
      })
    })

    describe("course_exists", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
        ctx!.client.setHeader("Authorization", "Bearer normal")
      })

      it("returns true on existing course", async () => {
        const res = await ctx.client.request(courseExistsQuery, {
          slug: "course1",
        })

        expect(res).toEqual({ course_exists: true })
      })

      it("returns false on non-existing course", async () => {
        const res = await ctx.client.request(courseExistsQuery, {
          slug: "bogus",
        })

        expect(res).toEqual({ course_exists: false })
      })
    })

    describe("handlerCourses", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
        ctx!.client.setHeader("Authorization", "Bearer admin")
      })

      it("returns correctly", async () => {
        const res = await ctx.client.request(handlerCoursesQuery)

        expect(res.handlerCourses).toMatchSnapshot()
      })

      it("errors with non-admin", async () => {
        ctx!.client.setHeader("Authorization", "Bearer normal")
        try {
          await ctx!.client.request(handlerCoursesQuery)
          fail()
        } catch {}
      })
    })
  })
})

const courseQuery = gql`
  query course($id: ID, $slug: String, $language: String) {
    course(id: $id, slug: $slug, language: $language) {
      id
      name
      slug
      description
      link
    }
  }
`

const fullCourseQuery = gql`
  query course(
    $id: ID
    $slug: String
    $language: String
    $includeDeletedExercises: Boolean
  ) {
    course(id: $id, slug: $slug, language: $language) {
      id
      name
      slug
      ects
      order
      study_module_order
      teacher_in_charge_name
      teacher_in_charge_email
      support_email
      start_date
      end_date
      tier
      photo {
        id
        compressed
        compressed_mimetype
        uncompressed
        uncompressed_mimetype
      }
      promote
      start_point
      hidden
      study_module_start_point
      status
      course_translations {
        id
        name
        language
        description
        link
      }
      open_university_registration_links {
        id
        course_code
        language
        link
      }
      study_modules {
        id
      }
      course_variants {
        id
        slug
        description
      }
      course_aliases {
        id
        course_code
      }
      inherit_settings_from {
        id
      }
      completions_handled_by {
        id
      }
      has_certificate
      user_course_settings_visibilities {
        id
        language
      }
      exercises(includeDeleted: $includeDeletedExercises) {
        id
        name
        deleted
      }
      upcoming_active_link
      automatic_completions
      automatic_completions_eligible_for_ects
      exercise_completions_needed
      points_needed
      course_tags {
        tag {
          id
          tag_translations {
            name
            description
            language
          }
          color
        }
      }
    }
  }
`

const coursesQuery = gql`
  query AllCourses(
    $language: String
    $orderBy: CourseOrderByInput
    $search: String
    $hidden: Boolean
    $handledBy: String
  ) {
    courses(
      orderBy: $orderBy
      language: $language
      search: $search
      hidden: $hidden
      handledBy: $handledBy
    ) {
      id
      slug
      name
      order
      study_module_order
      photo {
        id
        compressed
        uncompressed
      }
      promote
      status
      start_point
      study_module_start_point
      hidden
      description
      link
      upcoming_active_link
      study_modules {
        id
        slug
      }
      course_translations {
        id
        language
        name
      }
      user_course_settings_visibilities {
        id
        language
      }
    }
  }
`

const courseExistsQuery = gql`
  query courseExists($slug: String!) {
    course_exists(slug: $slug)
  }
`

const handlerCoursesQuery = gql`
  query handlerCourses {
    handlerCourses {
      id
      handles_completions_for {
        id
      }
    }
  }
`

const sortArrayField =
  (field: string, id: Array<string> = ["id"]) =>
  (object: any) => {
    if (!get(object, field)) {
      return object
    }

    return {
      ...object,
      [field]: orderBy(get(object, field), id, ["asc"]),
    }
  }
// study_modules may be returned in any order, let's just sort them so snapshots are equal

const sortStudyModules = sortArrayField("study_modules")
const sortExercises = sortArrayField("exercises")
const sortCourseTags = (course: any) =>
  sortArrayField("course_tags", ["tag_id"])({
    ...course,
    course_tags: course?.course_tags.map((course_tag: any) => ({
      ...course_tag,
      tag: sortArrayField("tag_translations", ["language"])(course_tag.tag),
    })),
  })

const applySortFns = (sortFns: Array<<T>(course: T) => T>) => (course: any) => {
  return sortFns.reduce((course, fn) => fn(course), course)
}
