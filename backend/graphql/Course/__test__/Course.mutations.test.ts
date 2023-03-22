import { createReadStream } from "fs"

import { gql } from "graphql-request"
import { mocked } from "jest-mock"
import { omit } from "lodash"

import KafkaProducer from "../../../services/kafkaProducer"
import { fakeTMCCurrent, getTestContext, ID_REGEX } from "../../../tests"
import { adminUserDetails, normalUserDetails } from "../../../tests/data"
import { seed } from "../../../tests/data/seed"
import { courseInclude } from "./util"

jest.mock("../../../services/kafkaProducer")

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
})

const anyPhoto = {
  photo_id: expect.stringMatching(ID_REGEX),
  photo: {
    original: expect.stringContaining("image.gif"),
    compressed: expect.stringContaining("webp"),
    uncompressed: expect.stringContaining("jpeg"),
  },
}

describe("Course", () => {
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
      language: "en",
      tags: [
        {
          id: "tag1",
        },
      ],
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
      language: "en",
      tags: [
        {
          id: "tag2",
        },
      ],
    })

    const expectedAddedCourse = {
      photo: {
        ...anyPhoto.photo,
      },
    }

    const expectedUpdatedCourse = {
      id: "00000000-0000-0000-0000-000000000002",
      study_modules: [
        {
          id: "00000000-0000-0000-0000-000000000101",
        },
      ],
    }

    type TestCase = [
      string,
      {
        data: Record<string, unknown>
        expected: Record<string, unknown>
        omitIdFields?: Array<string>
      },
    ]

    describe("addCourse", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
        ctx.client.setHeader("Authorization", "Bearer admin")
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
            omitIdFields: ["photo_id"],
          },
        ],
        [
          "with no course tags",
          {
            data: omit(getNewCourse(), "tags"),
            expected: omit(expectedAddedCourse, "tags"),
          },
        ],
      ]

      test.each(cases)(
        "creates a course %s",
        async (_, { data, expected, omitIdFields = [] }) => {
          const res = await ctx.client.request<any>(createCourseMutation, {
            course: data,
          })

          expect(res.addCourse).toMatchStrippedSnapshot(expected, {
            excludePaths: ["tags.id"],
          })

          expect(KafkaProducer).toHaveBeenCalledTimes(1)

          const createdCourse = await ctx.prisma.course.findUnique({
            where: { slug: "new1" },
            include: courseInclude,
          })

          expect(
            mocked(KafkaProducer).mock.instances[0].queueProducerMessage,
          ).toHaveBeenCalledWith({
            message: JSON.stringify(
              omit(createdCourse, Object.keys(courseInclude)),
            ),
            partition: null,
            topic: "new-course",
          })

          const hasPhoto = Boolean(expected?.photo)

          expect(createdCourse).not.toEqual(null)
          expect(createdCourse?.id).toEqual(res.addCourse.id)
          expect(createdCourse).toMatchStrippedSnapshot(
            {
              ...(hasPhoto && {
                photo: {
                  ...anyPhoto.photo,
                  original: expect.stringContaining("image.gif"),
                },
              }),
            },
            {
              idFields: ["id", "course_id", "photo_id"].filter(
                (f) => !omitIdFields.includes(f),
              ), //.filter(isNotNullOrUndefined),
              excludePaths: ["tags.id"],
            },
          )
        },
      )

      it("errors with non-admin", async () => {
        ctx.client.setHeader("Authorization", "Bearer normal")
        try {
          await ctx.client.request(createCourseMutation, {
            course: getNewCourse(),
          })
          fail()
        } catch {}
      })
    })

    describe("updateCourse", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
        ctx.client.setHeader("Authorization", "Bearer admin")
      })

      it("errors on no slug given", async () => {
        try {
          await ctx.client.request(updateCourseMutation, {
            course: omit(getUpdateCourse(), "slug"),
          })
          fail()
        } catch {}
      })

      it("updates course", async () => {
        const res = await ctx.client.request<any>(updateCourseMutation, {
          course: {
            ...getUpdateCourse(),
            new_photo: undefined,
          },
        })

        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            ...expectedUpdatedCourse,
            photo: {
              ...anyPhoto.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id"],
          },
        )

        const oldCourse = await ctx.prisma.course.findUnique({
          where: { slug: "course1" },
          include: courseInclude,
        })
        expect(oldCourse).toBeNull()
        const updatedCourse = await ctx.prisma.course.findUnique({
          where: { slug: "updated_course1" },
          include: courseInclude,
        })
        expect(updatedCourse).toMatchStrippedSnapshot(
          {
            ...anyPhoto,
            photo: {
              ...anyPhoto.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id"],
          },
        )
      })

      it("updates language tag", async () => {
        const res = await ctx.client.request<any>(updateCourseMutation, {
          course: {
            ...getUpdateCourse(),
            new_photo: undefined,
            new_slug: "course1",
            language: "fi",
          },
        })
        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            ...expectedUpdatedCourse,
            photo: {
              ...anyPhoto.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id"],
          },
        )
        const updatedCourse = await ctx.prisma.course.findUnique({
          where: { slug: "course1" },
          include: courseInclude,
        })
        expect(updatedCourse).toMatchStrippedSnapshot(
          {
            ...anyPhoto,
            photo: {
              ...anyPhoto.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id"],
          },
        )
      })

      it("removes language tag", async () => {
        const res = await ctx.client.request<any>(updateCourseMutation, {
          course: {
            ...getUpdateCourse(),
            new_photo: undefined,
            new_slug: "course1",
            language: undefined,
          },
        })
        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            ...expectedUpdatedCourse,
            photo: {
              ...anyPhoto.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id"],
          },
        )
        const updatedCourse = await ctx.prisma.course.findUnique({
          where: { slug: "course1" },
          include: courseInclude,
        })
        expect(updatedCourse).toMatchStrippedSnapshot(
          {
            ...anyPhoto,
            photo: {
              ...anyPhoto.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id"],
          },
        )
      })

      it("updates photo", async () => {
        const res = await ctx.client.request<any>(updateCourseMutation, {
          course: getUpdateCourse(),
        })

        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            photo: {
              ...anyPhoto.photo,
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id"],
          },
        )

        const oldCourse = await ctx.prisma.course.findUnique({
          where: { slug: "course1" },
          include: courseInclude,
        })
        expect(oldCourse).toBeNull()
        const oldImage = await ctx.prisma.image.findUnique({
          where: { id: "00000000000000000000000000001101" },
        })
        expect(oldImage).toBeNull()

        const updatedCourse = await ctx.prisma.course.findUnique({
          where: { slug: "updated_course1" },
          include: courseInclude,
        })
        expect(updatedCourse).toMatchStrippedSnapshot(
          {
            ...anyPhoto,
            photo_id: expect.not.stringContaining(
              "00000000000000000000000000001101",
            ),
          },
          {
            excludePaths: ["tags.id"],
          },
        )
      })

      it("deletes photo", async () => {
        const res = await ctx.client.request<any>(updateCourseMutation, {
          course: {
            ...getUpdateCourse(),
            new_photo: undefined,
            new_slug: undefined,
            delete_photo: true,
          },
        })

        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            ...expectedUpdatedCourse,
            photo: null,
          },
          { excludePaths: ["tags.id"] },
        )
        const updatedCourse = await ctx.prisma.course.findUnique({
          where: { slug: "course1" },
          include: courseInclude,
        })
        expect(updatedCourse).toMatchStrippedSnapshot(
          {},
          { excludePaths: ["tags.id"] },
        )
      })

      it("errors with non-admin", async () => {
        ctx.client.setHeader("Authorization", "Bearer normal")
        try {
          await ctx.client.request(updateCourseMutation, {
            course: getUpdateCourse(),
          })
          fail()
        } catch {}
      })
    })

    describe("deleteCourse", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
        ctx.client.setHeader("Authorization", "Bearer admin")
      })

      it("deletes course on id", async () => {
        const res = await ctx.client.request(deleteCourseMutation, {
          id: "00000000000000000000000000000002",
        })

        expect(res).toMatchSnapshot()
        const deletedCourse = await ctx.prisma.course.findUnique({
          where: { id: "00000000000000000000000000000002" },
        })
        expect(deletedCourse).toBeNull()
        const deletedImage = await ctx.prisma.image.findUnique({
          where: { id: "00000000000000000000000000001101" },
        })
        expect(deletedImage).toBeNull()
      })

      it("deletes course on slug", async () => {
        const res = await ctx.client.request(deleteCourseMutation, {
          slug: "course1",
        })

        expect(res).toMatchSnapshot()
        const deletedCourse = await ctx.prisma.course.findUnique({
          where: { slug: "course1" },
        })
        expect(deletedCourse).toBeNull()
      })

      it("errors with non-admin", async () => {
        ctx.client.setHeader("Authorization", "Bearer normal")
        try {
          await ctx.client.request(deleteCourseMutation, {
            slug: "course1",
          })
          fail()
        } catch {}
      })
    })
  })
})

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
      language
      tags {
        id
        hidden
        types
        tag_translations {
          name
          description
          language
        }
      }
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
      language
      tags {
        id
        hidden
        types
        tag_translations {
          name
          description
          language
        }
      }
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
