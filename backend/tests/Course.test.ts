import { gql } from "graphql-request"
import { getTestContext, fakeTMC } from "./__helpers"
import {
  //normalUser,
  normalUserDetails,
  //adminUser,
  adminUserDetails,
  courseModules,
} from "./data"
import { seed } from "./data/seed"

import { Course, StudyModule } from "@prisma/client"

const ctx = getTestContext()
const tmc = fakeTMC({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
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
  query course($id: ID, $slug: String, $language: String) {
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
      upcoming_active_link
      automatic_completions
      automatic_completions_eligible_for_ects
      exercise_completions_needed
      points_needed
    }
  }
`

const coursesQuery = gql`
  query AllCourses($language: String, $orderBy: CourseOrderByInput) {
    courses(orderBy: $orderBy, language: $language) {
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

describe("course queries", () => {
  beforeAll(() => tmc.setup())
  afterAll(() => tmc.teardown())

  describe("course", () => {
    let createdCourses: Course[] | null = null

    beforeEach(async () => {
      createdCourses = (await seed(ctx.prisma)).courses
    })

    afterEach(() => (createdCourses = null))

    describe("normal user", () => {
      beforeEach(() => ctx!.client.setHeader("Authorization", "Bearer normal"))

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
          expect(res).toMatchSnapshot({
            course: {
              id: expect.any(String),
            },
          }),
        )
      })

      it("returns correct language", async () => {
        const res = await ctx.client.request(courseQuery, {
          slug: "course1",
          language: "en_US",
        })

        expect(res).toMatchSnapshot({
          course: {
            id: expect.any(String),
          },
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
          expect(res).toMatchSnapshot({
            course: {
              id: expect.any(String),
            },
          }),
        )
      })
    })
  })

  describe("courses", () => {
    // @ts-ignore: not used
    let createdCourses: Course[] | null = null

    beforeEach(async () => {
      createdCourses = (await seed(ctx.prisma)).courses
    })

    afterEach(() => (createdCourses = null))

    it("returns courses", async () => {
      const res = await ctx.client.request(coursesQuery)

      expect(res).toMatchSnapshot()
    })

    it("returns courses ordered", async () => {
      await Promise.all(
        ["asc", "desc"].map(async (order: string) => {
          const res = await ctx.client.request(coursesQuery, {
            orderBy: { name: order },
          })

          expect(res).toMatchSnapshot()
        }),
      )
    })

    it("returns courses filtered by language", async () => {
      await Promise.all(
        ["fi_FI", "en_US", "bogus"].map(async (language: string) => {
          const res = await ctx.client.request(coursesQuery, {
            language: language,
          })

          expect(res).toMatchSnapshot()
        }),
      )
    })
  })
})
