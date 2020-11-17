import { gql } from "graphql-request"
import { getTestContext, fakeTMC } from "./__helpers"
import {
  //normalUser,
  normalUserDetails,
  //adminUser,
  adminUserDetails,
} from "./data"
import { seed } from "./data/seed"

import { Course } from "@prisma/client"
import { orderBy } from "lodash"

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

const courseExistsQuery = gql`
  query courseExists($slug: String!) {
    course_exists(slug: $slug)
  }
`

const createCourseMutation = gql`
  mutation createCourse($course: CourseCreateArg!) {
    addCourse(course: $course) {
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

// study_modules may be returned in any order, let's just sort them so snapshots are equal
const sortStudyModules = (course: any) => {
  if (!course.study_modules) {
    return course
  }

  return {
    ...course,
    study_modules: orderBy(course.study_modules, ["id"], ["asc"]),
  }
}

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
          expect(sortStudyModules(res.course)).toMatchSnapshot({
            id: expect.any(String),
          }),
        )
      })

      it("returns correct language", async () => {
        const res = await ctx.client.request(courseQuery, {
          slug: "course1",
          language: "en_US",
        })

        expect(sortStudyModules(res.course)).toMatchSnapshot({
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
          expect(sortStudyModules(res.course)).toMatchSnapshot({
            id: expect.any(String),
          }),
        )
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
      await Promise.all(
        ["asc", "desc"].map(async (order: string) => {
          const res = await ctx.client.request(coursesQuery, {
            orderBy: { name: order },
          })

          expect(res.courses.map(sortStudyModules)).toMatchSnapshot(
            `courses-${order}`,
          )

          return null
        }),
      )
    })

    it("returns courses filtered by language", async () => {
      await Promise.all(
        ["fi_FI", "en_US", "bogus"].map(async (language: string) => {
          const res = await ctx.client.request(coursesQuery, {
            language,
          })

          expect(
            orderBy(res.courses?.map(sortStudyModules), ["id"]),
          ).toMatchSnapshot(`courses-${language}`)

          return null
        }),
      )
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
})

describe("course mutations", () => {
  beforeAll(() => tmc.setup())
  afterAll(() => tmc.teardown())

  const newCourse = {
    name: "new1",
    slug: "new1",
    start_date: "01/01/1900",
    teacher_in_charge_email: "e@mail.com",
    teacher_in_charge_name: "teacher",
    study_modules: [{ id: "00000000000000000000000000000101" }],
    course_translations: [
      {
        description: "description_en_US",
        language: "en_US",
        name: "name_en_US",
      },
    ],
  }

  describe("addCourse", () => {
    beforeEach(async () => {
      await seed(ctx.prisma)
      ctx!.client.setHeader("Authorization", "Bearer admin")
    })

    it("creates a course ", async () => {
      const res = await ctx!.client.request(createCourseMutation, {
        course: newCourse,
      })

      expect(res).toMatchSnapshot({
        addCourse: {
          id: expect.any(String),
          course_translations: [
            {
              id: expect.any(String),
            },
          ],
        },
      })

      const createdCourse = await ctx.prisma.course.findFirst({
        where: { slug: "new1" },
      })

      expect(createdCourse).not.toEqual(null)
      expect(createdCourse!.id).toEqual(res.addCourse.id)
      expect(createdCourse).toMatchSnapshot({
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        id: expect.any(String),
      })
    })
  })
})
