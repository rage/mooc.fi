import { gql } from "graphql-request"

import { Course } from "@prisma/client"

import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  ID_REGEX,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data/seed"
import { applySortFns, sortExercises, sortStudyModules, sortTags } from "./util"

jest.mock("../../../services/kafkaProducer")

const ctx = getTestContext()

describe("Course", () => {
  describe("queries", () => {
    setupTMCWithDefaultFakeUsers()

    describe("course", () => {
      let createdCourses: Course[] | null = null

      beforeEach(async () => {
        createdCourses = (await seed(ctx.prisma)).courses
      })

      afterEach(() => (createdCourses = null))

      describe("normal user", () => {
        it("should error on no parameters", async () => {
          try {
            await ctx.client.request(
              courseQuery,
              {},
              FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
            )
            fail()
          } catch {}
        })

        it("returns course on id and slug", async () => {
          const resId = await ctx.client.request<any>(
            courseQuery,
            {
              id: createdCourses?.[0].id,
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )
          const resSlug = await ctx.client.request<any>(
            courseQuery,
            {
              slug: "course1",
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )

          ;[resId, resSlug].forEach((res: any) =>
            // had sortStudyModules
            expect(res.course).toMatchSnapshot({
              id: expect.stringMatching(ID_REGEX),
            }),
          )
        })

        it("returns correct language", async () => {
          const res = await ctx.client.request<any>(
            courseQuery,
            {
              slug: "course1",
              language: "en_US",
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )

          // had sortStudyModules
          expect(res.course).toMatchSnapshot({
            id: expect.stringMatching(ID_REGEX),
          })
        })

        it("should return null on non-existent language", async () => {
          const res = await ctx.client.request<any>(
            courseQuery,
            {
              slug: "course1",
              language: "sv_SE",
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )

          expect(res).toEqual({ course: null })
        })

        it("should error on invalid id and slug", async () => {
          try {
            await ctx.client.request(
              courseQuery,
              {
                id: new Array(33).join("1"),
              },
              FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
            )
            fail()
          } catch {}
          try {
            await ctx.client.request(
              courseQuery,
              {
                slug: "invalid",
              },
              FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
            )
            fail()
          } catch {}
        })
      })

      describe("admin", () => {
        it("returns full course on id and slug", async () => {
          const resId = await ctx.client.request<any>(
            fullCourseQuery,
            {
              id: createdCourses?.[0].id,
            },
            FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
          )
          const resSlug = await ctx.client.request<any>(
            fullCourseQuery,
            {
              slug: "course1",
            },
            FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
          )

          ;[resId, resSlug].forEach((res: any) =>
            expect(
              applySortFns([sortExercises, sortStudyModules, sortTags])(
                res.course,
              ),
            ).toMatchSnapshot({
              id: expect.stringMatching(ID_REGEX),
            }),
          )
        })

        it("should include deleted exercises if specified", async () => {
          const res = await ctx.client.request<any>(
            fullCourseQuery,
            {
              slug: "course1",
              includeDeletedExercises: true,
            },
            FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
          )

          expect(
            applySortFns([sortExercises, sortStudyModules, sortTags])(
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
        const res = await ctx.client.request<any>(coursesQuery)

        expect(res.courses).toBeDefined()
        expect(Array.isArray(res.courses)).toBe(true)
        expect(res.courses.length).toBeGreaterThan(0)

        res.courses.forEach((course: any) => {
          expect(course).toHaveProperty("id")
          expect(course).toHaveProperty("slug")
          expect(course).toHaveProperty("name")
          expect(course).toHaveProperty("description")
          expect(course).toHaveProperty("link")
        })
      })

      it("returns courses ordered", async () => {
        for (const order of ["asc", "desc"]) {
          const res = await ctx.client.request<any>(coursesQuery, {
            orderBy: [{ name: order }],
          })

          expect(res.courses).toBeDefined()
          expect(res.courses.length).toBeGreaterThan(0)

          const names = res.courses.map((c: any) => c.name).filter(Boolean)
          expect(names.length).toBeGreaterThan(0)

          const sortedNames = [...names].sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" }),
          )
          if (order === "desc") {
            sortedNames.reverse()
          }

          expect(names).toEqual(sortedNames)
        }
      })

      it("returns courses filtered by language", async () => {
        for (const language of ["fi_FI", "en_US", "bogus"]) {
          const res = await ctx.client.request<any>(coursesQuery, {
            language,
          })

          expect(res.courses).toBeDefined()
          expect(Array.isArray(res.courses)).toBe(true)

          res.courses.forEach((course: any) => {
            expect(course).toHaveProperty("id")
            expect(course).toHaveProperty("name")
            expect(course).toHaveProperty("description")
            expect(course).toHaveProperty("link")

            if (
              course.course_translations &&
              course.course_translations.length > 0
            ) {
              const hasTranslationForLanguage = course.course_translations.some(
                (t: any) => t.language === language,
              )
              if (hasTranslationForLanguage) {
                const translation = course.course_translations.find(
                  (t: any) => t.language === language,
                )
                expect(course.name).toBe(translation.name)
                expect(course.description).toBe(translation.description ?? "")
                expect(course.link).toBe(translation.link ?? "")
              }
            }
          })
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
          const res = await ctx.client.request<any>(coursesQuery, {
            search,
          })

          const resultSlugs = res.courses?.map((c: Course) => c.slug).sort()

          expected.sort()
          expect(resultSlugs).toEqual(expected)
        }
      })

      it("filters hidden", async () => {
        for (const hidden of [true, false, null]) {
          const res = await ctx.client.request<any>(coursesQuery, {
            hidden,
          })

          expect(res.courses?.map((c: Course) => c.id).sort()).toMatchSnapshot(
            `courses-hidden-${hidden}`,
          )
        }
      })

      it("filters handledBy", async () => {
        for (const handledBy of ["handler", "foo"]) {
          const res = await ctx.client.request<any>(coursesQuery, {
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
      })

      it("returns true on existing course", async () => {
        const res = await ctx.client.request(
          courseExistsQuery,
          {
            slug: "course1",
          },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        expect(res).toEqual({ course_exists: true })
      })

      it("returns false on non-existing course", async () => {
        const res = await ctx.client.request(
          courseExistsQuery,
          {
            slug: "bogus",
          },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        expect(res).toEqual({ course_exists: false })
      })
    })

    describe("popularCourses", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)

        await ctx.prisma.course.update({
          where: { slug: "course2" },
          data: { status: "Ended" },
        })

        await ctx.prisma.course.update({
          where: { slug: "handled" },
          data: {
            status: "Active",
            course_translations: {
              create: {
                language: "fi_FI",
                name: "handled_fi_FI",
                description: "handled course description",
                created_at: "1900-01-01T10:00:00.00+02:00",
                updated_at: "1900-01-01T10:00:00.00+02:00",
              },
            },
          },
        })
      })

      it("returns courses filtered by language", async () => {
        const res = await ctx.client.request<any>(popularCoursesQuery, {
          popularCoursesForLanguage: "fi_FI",
        })

        expect(res.popularCourses).toBeDefined()
        expect(Array.isArray(res.popularCourses)).toBe(true)
        expect(res.popularCourses.length).toBeGreaterThan(0)
        expect(res.popularCourses.length).toBeLessThanOrEqual(4)

        res.popularCourses.forEach((course: any) => {
          expect(course).toHaveProperty("id")
          expect(course).toHaveProperty("slug")
          expect(course).toHaveProperty("name")
          expect(course).toHaveProperty("description")
          expect(course).toHaveProperty("link")
        })
      })

      it("excludes ended courses", async () => {
        const res = await ctx.client.request<any>(popularCoursesQuery, {
          popularCoursesForLanguage: "fi_FI",
        })

        const endedCourseSlugs = res.popularCourses
          .map((c: any) => c.slug)
          .filter((slug: string) => slug === "course2")

        expect(endedCourseSlugs.length).toBe(0)
      })

      it("excludes hidden courses", async () => {
        const res = await ctx.client.request<any>(popularCoursesQuery, {
          popularCoursesForLanguage: "fi_FI",
        })

        const hiddenCourseSlugs = res.popularCourses
          .map((c: any) => c.slug)
          .filter((slug: string) => slug === "handled")

        expect(hiddenCourseSlugs.length).toBe(0)
      })

      it("only returns courses with translations in the specified language", async () => {
        const res = await ctx.client.request<any>(popularCoursesQuery, {
          popularCoursesForLanguage: "fi_FI",
        })

        res.popularCourses.forEach((course: any) => {
          expect(course.name).toBeDefined()
          expect(course.description).toBeDefined()
        })
      })

      it("returns at most 4 courses", async () => {
        const res = await ctx.client.request<any>(popularCoursesQuery, {
          popularCoursesForLanguage: "fi_FI",
        })

        expect(res.popularCourses.length).toBeLessThanOrEqual(4)
      })

      it("returns empty array for language with no courses", async () => {
        const res = await ctx.client.request<any>(popularCoursesQuery, {
          popularCoursesForLanguage: "sv_SE",
        })

        expect(res.popularCourses).toBeDefined()
        expect(Array.isArray(res.popularCourses)).toBe(true)
        expect(res.popularCourses.length).toBe(0)
      })

      it("applies correct translations for the requested language", async () => {
        const res = await ctx.client.request<any>(popularCoursesQuery, {
          popularCoursesForLanguage: "fi_FI",
        })

        const course1 = res.popularCourses.find(
          (c: any) => c.slug === "course1",
        )

        if (course1) {
          expect(course1.name).toBe("course1_fi_FI")
          expect(course1.description).toBe("course1_description_fi_FI")
          expect(course1.link).toBe("http:/link.fi.com")
        }
      })
    })

    describe("handlerCourses", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("returns correctly", async () => {
        const res = await ctx.client.request<any>(
          handlerCoursesQuery,
          {},
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(res.handlerCourses).toMatchSnapshot()
      })

      it("errors with non-admin", async () => {
        try {
          await ctx.client.request(
            handlerCoursesQuery,
            {},
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )
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
        slug
        name
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
        slug
        name
      }
      completions_handled_by {
        id
        slug
        name
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
      tags(language: $language) {
        id
        hidden
        name
        description
        types
        tag_types {
          name
        }
        tag_translations {
          language
          name
          description
        }
      }
    }
  }
`

const coursesQuery = gql`
  query AllCourses(
    $language: String
    $orderBy: [CourseOrderByWithRelationAndSearchRelevanceInput!]
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
        name
      }
      course_translations {
        id
        language
        name
        description
        link
      }
      user_course_settings_visibilities {
        id
        language
      }
      tags(language: $language) {
        id
        hidden
        name
        description
        types
      }
    }
  }
`

const courseExistsQuery = gql`
  query courseExists($slug: String!) {
    course_exists(slug: $slug)
  }
`

const popularCoursesQuery = gql`
  query popularCourses($popularCoursesForLanguage: String!) {
    popularCourses(popularCoursesForLanguage: $popularCoursesForLanguage) {
      id
      slug
      name
      description
      link
      status
      hidden
    }
  }
`

const handlerCoursesQuery = gql`
  query handlerCourses {
    handlerCourses {
      id
      slug
      name
      handles_completions_for {
        id
        slug
        name
      }
    }
  }
`
