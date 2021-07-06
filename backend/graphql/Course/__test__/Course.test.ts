import { createReadStream } from "fs"
import { gql } from "graphql-request"
import { getTestContext, fakeTMCCurrent } from "../../../tests/__helpers"
import {
  //normalUser,
  normalUserDetails,
  //adminUser,
  adminUserDetails,
} from "../../../tests/data"
import { seed } from "../../../tests/data/seed"

import { Course } from "@prisma/client"
import { orderBy } from "lodash"
import { mocked } from "ts-jest/utils"
import { omit } from "lodash"

jest.mock("../../../services/kafkaProducer")
import KafkaProducer from "../../../services/kafkaProducer"

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
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
      exercises(includeDeleted: $includeDeletedExercises) {
        id
        name
        deleted
      }
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
        original
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

const updateCourseMutation = gql`
  mutation updateCourse($course: CourseUpsertArg!) {
    updateCourse(course: $course) {
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
        original
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

const deleteCourseMutation = gql`
  mutation deleteCourse($id: ID, $slug: String) {
    deleteCourse(id: $id, slug: $slug) {
      id
    }
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

const courseCompletionsQuery = gql`
  query courseCompletions(
    $slug: String
    $user_id: String
    $user_upstream_id: Int
  ) {
    course(slug: $slug) {
      id
      completions(user_id: $user_id, user_upstream_id: $user_upstream_id) {
        id
        user {
          id
          username
        }
        completion_language
        email
        user_upstream_id
      }
    }
  }
`
// study_modules may be returned in any order, let's just sort them so snapshots are equal
const sortStudyModules = (course: any) => {
  if (!course?.study_modules) {
    return course
  }

  return {
    ...course,
    study_modules: orderBy(course.study_modules, ["id"], ["asc"]),
  }
}

const sortExercises = (course: any) => {
  if (!course?.exercises) {
    return course
  }

  return {
    ...course,
    exercises: orderBy(course.exercises, ["id"]),
  }
}

describe("Course", () => {
  afterAll(() => jest.clearAllMocks())

  describe("model", () => {
    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    describe("completions", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("errors on no admin", async () => {
        return ctx.client
          .request(
            courseCompletionsQuery,
            {
              slug: "course1",
              user_upstream_id: 1,
            },
            {
              Authorization: "Bearer normal",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors?.length).toBe(1)
            expect(response.errors[0].message).toContain("Not authorized")
            expect(response.status).toBe(200)
          })
      })

      it("errors with no user_id or user_upstream_id", async () => {
        return ctx.client
          .request(
            courseCompletionsQuery,
            {
              slug: "course1",
            },
            {
              Authorization: "Bearer admin",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors?.length).toBe(1)
            expect(response.errors[0].message).toContain(
              "needs user_id or user_upstream_id",
            )
            expect(response.status).toBe(200)
          })
      })

      it("works with user_id", async () => {
        const res = await ctx.client.request(
          courseCompletionsQuery,
          {
            slug: "course1",
            user_id: "20000000000000000000000000000103",
          },
          {
            Authorization: "Bearer admin",
          },
        )

        expect({
          ...res,
          completions: orderBy(res.completions, "id"),
        }).toMatchSnapshot()
      })

      it("works with user_upstream_id", async () => {
        const res = await ctx.client.request(
          courseCompletionsQuery,
          {
            slug: "course1",
            user_upstream_id: 1,
          },
          {
            Authorization: "Bearer admin",
          },
        )

        expect({
          ...res,
          completions: orderBy(res.completions, "id"),
        }).toMatchSnapshot()
      })

      it("shouldn't return anything with non-existent user", async () => {
        const res = await ctx.client.request(
          courseCompletionsQuery,
          {
            slug: "course1",
            user_upstream_id: 4939298,
          },
          {
            Authorization: "Bearer admin",
          },
        )

        expect({
          ...res,
          completions: orderBy(res.completions, "id"),
        }).toMatchSnapshot()
      })
    })
  })

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
            expect(sortExercises(sortStudyModules(res.course))).toMatchSnapshot(
              {
                id: expect.any(String),
              },
            ),
          )
        })

        it("should include deleted exercises if specified", async () => {
          const res = await ctx.client.request(fullCourseQuery, {
            slug: "course1",
            includeDeletedExercises: true,
          })

          expect(sortExercises(sortStudyModules(res.course))).toMatchSnapshot()
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
            `courses-hidden-${hidden || "null"}`,
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

  describe("mutations", () => {
    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    const getNewCourse = () => ({
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
      course_variants: [
        {
          slug: "variant1",
          description: "variant1",
        },
      ],
      course_aliases: [
        {
          course_code: "alias1",
        },
      ],
      inherit_settings_from: "00000000000000000000000000000002",
      completions_handled_by: "00000000000000000000000000000002",
      user_course_settings_visibilities: [{ language: "en_US" }],
      new_photo: createReadStream(__dirname + "/../../../tests/data/image.gif"),
    })

    const getUpdateCourse = () => ({
      // id: "00000000000000000000000000000002",
      name: "updated course1",
      slug: "course1",
      new_slug: "updated_course1",
      start_date: "02/01/1900",
      end_date: "12/30/2100",
      teacher_in_charge_email: "updated-e@mail.com",
      teacher_in_charge_name: "updated teacher",
      course_translations: [
        {
          id: "00000000-0000-0000-0000-000000000011",
          description: "course1_updated_description_en_US",
          language: "en_US",
          name: "course1_en_US",
          link: "http://link.com",
        },
        {
          description: "course1_added_description_se_SE",
          language: "se_SE",
          name: "course1_se_SE",
          link: "http:/link.se.com",
        },
      ],
      study_modules: [
        {
          id: "00000000-0000-0000-0000-000000000101",
        },
      ],
      course_variants: [
        {
          slug: "variant1",
          description: "variant1",
        },
      ],
      course_aliases: [
        {
          course_code: "alias1",
        },
      ],
      inherit_settings_from: "00000000000000000000000000000001",
      completions_handled_by: "00000000000000000000000000000001",
      user_course_settings_visibilities: [{ language: "en_US" }],
      photo: "00000000000000000000000000001101",
      new_photo: createReadStream(__dirname + "/../../../tests/data/image.gif"),
    })

    const expectedAddedCourse = {
      id: expect.any(String),
      course_translations: [
        {
          id: expect.any(String),
        },
      ],
      course_variants: [
        {
          id: expect.any(String),
        },
      ],
      course_aliases: [
        {
          id: expect.any(String),
        },
      ],
      photo: {
        original: expect.stringContaining("image.gif"),
        compressed: expect.stringContaining("webp"),
        uncompressed: expect.stringContaining("jpeg"),
        id: expect.any(String),
      },
      user_course_settings_visibilities: [
        {
          id: expect.any(String),
        },
      ],
    }

    const expectedUpdatedCourse = {
      id: "00000000-0000-0000-0000-000000000002",
      study_modules: [
        {
          id: expect.stringMatching("00000000-0000-0000-0000-000000000101"),
        },
      ],
      course_translations: [
        {
          id: expect.any(String),
        },
        {
          id: expect.any(String),
        },
      ],
      course_variants: [
        {
          id: expect.any(String),
        },
      ],
      course_aliases: [
        {
          id: expect.any(String),
        },
      ],
      photo: {
        original: expect.stringContaining("image.gif"),
        compressed: expect.stringContaining("webp"),
        uncompressed: expect.stringContaining("jpeg"),
        id: expect.any(String),
      },
      user_course_settings_visibilities: [
        {
          id: expect.any(String),
        },
      ],
    }

    type TestCase = [
      string,
      {
        data: object
        expected: object
      },
    ]

    describe("addCourse", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
        ctx!.client.setHeader("Authorization", "Bearer admin")
        mocked(KafkaProducer).mockClear()
      })

      const cases: TestCase[] = [
        [
          "full",
          {
            data: getNewCourse(),
            expected: expectedAddedCourse,
          },
        ],
        [
          "with no course_translations",
          {
            data: omit(getNewCourse(), "course_translations"),
            expected: omit(expectedAddedCourse, "course_translations"),
          },
        ],
        [
          "with no study_modules",
          {
            data: omit(getNewCourse(), "study_modules"),
            expected: expectedAddedCourse,
          },
        ],
        [
          "with no photo",
          {
            data: omit(getNewCourse(), "new_photo"),
            expected: omit(expectedAddedCourse, "photo"),
          },
        ],
      ]

      test.each(cases)("creates a course %s", async (_, { data, expected }) => {
        const res = await ctx!.client.request(createCourseMutation, {
          course: data,
        })

        expect(res).toMatchSnapshot({
          addCourse: expected,
        })

        expect(KafkaProducer).toHaveBeenCalledTimes(1)

        const createdCourse = await ctx.prisma.course.findFirst({
          where: { slug: "new1" },
        })
        expect(
          mocked(KafkaProducer).mock.instances[0].queueProducerMessage,
        ).toHaveBeenCalledWith({
          message: JSON.stringify(createdCourse),
          partition: null,
          topic: "new-course",
        })

        expect(createdCourse).not.toEqual(null)
        expect(createdCourse!.id).toEqual(res.addCourse.id)
        expect(createdCourse).toMatchSnapshot({
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          id: expect.any(String),
          photo_id: (expected as any).photo ? expect.any(String) : null,
        })
      })

      it("errors with non-admin", async () => {
        ctx!.client.setHeader("Authorization", "Bearer normal")
        try {
          await ctx!.client.request(createCourseMutation, {
            course: cases[0],
          })
          fail()
        } catch {}
      })
    })

    describe("updateCourse", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
        ctx!.client.setHeader("Authorization", "Bearer admin")
      })

      it("errors on no slug given", async () => {
        try {
          await ctx!.client.request(updateCourseMutation, {
            course: omit(getUpdateCourse(), "slug"),
          })
          fail()
        } catch {}
      })

      it("updates course", async () => {
        const res = await ctx!.client.request(updateCourseMutation, {
          course: {
            ...getUpdateCourse(),
            new_photo: undefined,
          },
        })

        expect(res).toMatchSnapshot({
          updateCourse: {
            ...expectedUpdatedCourse,
            photo: {
              ...expectedUpdatedCourse.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
        })

        const oldCourse = await ctx.prisma.course.findFirst({
          where: { slug: "course1" },
        })
        expect(oldCourse).toBeNull()
        const updatedCourse = await ctx.prisma.course.findFirst({
          where: { slug: "updated_course1" },
        })
        expect(updatedCourse).toMatchSnapshot({
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          photo_id: expect.any(String),
        })
      })

      it("updates photo", async () => {
        const res = await ctx!.client.request(updateCourseMutation, {
          course: getUpdateCourse(),
        })

        expect(res).toMatchSnapshot({
          updateCourse: expectedUpdatedCourse,
        })

        const oldCourse = await ctx.prisma.course.findFirst({
          where: { slug: "course1" },
        })
        expect(oldCourse).toBeNull()
        const oldImage = await ctx.prisma.image.findFirst({
          where: { id: "00000000000000000000000000001101" },
        })
        expect(oldImage).toBeNull()

        const updatedCourse = await ctx.prisma.course.findFirst({
          where: { slug: "updated_course1" },
        })
        expect(updatedCourse).toMatchSnapshot({
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          photo_id: expect.any(String),
        })
      })

      it("deletes photo", async () => {
        const res = await ctx!.client.request(updateCourseMutation, {
          course: {
            ...getUpdateCourse(),
            new_photo: undefined,
            new_slug: undefined,
            delete_photo: true,
          },
        })

        expect(res).toMatchSnapshot({
          updateCourse: {
            ...expectedUpdatedCourse,
            photo: null,
          },
        })
        const updatedCourse = await ctx.prisma.course.findFirst({
          where: { slug: "course1" },
        })
        expect(updatedCourse).toMatchSnapshot({
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      })

      it("errors with non-admin", async () => {
        ctx!.client.setHeader("Authorization", "Bearer normal")
        try {
          await ctx!.client.request(updateCourseMutation, {
            course: getUpdateCourse(),
          })
          fail()
        } catch {}
      })
    })

    describe("deleteCourse", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
        ctx!.client.setHeader("Authorization", "Bearer admin")
      })

      it("deletes course on id", async () => {
        const res = await ctx!.client.request(deleteCourseMutation, {
          id: "00000000000000000000000000000002",
        })

        expect(res).toMatchSnapshot()
        const deletedCourse = await ctx.prisma.course.findFirst({
          where: { id: "00000000000000000000000000000002" },
        })
        expect(deletedCourse).toBeNull()
        const deletedImage = await ctx.prisma.image.findFirst({
          where: { id: "00000000000000000000000000001101" },
        })
        expect(deletedImage).toBeNull()
      })

      it("deletes course on slug", async () => {
        const res = await ctx!.client.request(deleteCourseMutation, {
          slug: "course1",
        })

        expect(res).toMatchSnapshot()
        const deletedCourse = await ctx.prisma.course.findFirst({
          where: { slug: "course1" },
        })
        expect(deletedCourse).toBeNull()
      })

      it("errors with non-admin", async () => {
        ctx!.client.setHeader("Authorization", "Bearer normal")
        try {
          await ctx!.client.request(deleteCourseMutation, {
            slug: "course1",
          })
          fail()
        } catch {}
      })
    })
  })
})
