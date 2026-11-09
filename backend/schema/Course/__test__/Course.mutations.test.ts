// import { createReadStream } from "fs"
import { gql } from "graphql-request"
import { omit } from "lodash"

import KafkaProducer from "../../../services/kafkaProducer"
import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  ID_REGEX,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data/seed"
import { courseInclude } from "./util"

jest.mock("../../../services/kafkaProducer")

const ctx = getTestContext()

const anyPhoto = {
  photo_id: expect.stringMatching(ID_REGEX),
  photo: {
    original: expect.stringContaining("image.gif"),
    compressed: expect.stringContaining("webp"),
    uncompressed: expect.stringContaining("jpeg"),
  },
}

const noPhoto = {
  photo: null,
}

describe("Course", () => {
  describe("mutations", () => {
    setupTMCWithDefaultFakeUsers()

    const getNewCourse = () => ({
      name: "new1",
      slug: "new1",
      start_date: "1900-01-01T08:00:00.000Z",
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
      // graphql-request removed support for file uploads
      // new_photo: createReadStream(__dirname + "/../../../tests/data/image.gif"),
      language: "en",
      tags: [
        {
          id: "tag1",
        },
      ],
      sponsors: [
        {
          id: "sponsor1",
        },
      ],
    })

    const getUpdateCourse = () => ({
      // id: "00000000000000000000000000000002",
      name: "updated course1",
      slug: "course1",
      new_slug: "updated_course1",
      start_date: "1900-02-01T08:00:00.000Z",
      end_date: "2100-12-30T08:00:00.000Z",
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
      // graphql-request removed support for file uploads
      // new_photo: createReadStream(__dirname + "/../../../tests/data/image.gif"),
      language: "en",
      tags: [
        {
          id: "tag2",
        },
      ],
      sponsors: [
        {
          id: "sponsor1",
        },
        {
          id: "sponsor2",
        },
      ],
    })

    const expectedAddedCourse = {
      photo: null,
      // graphql-request removed support for file uploads
      /*photo: {
        ...anyPhoto.photo,
      }*/
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
        jest.mocked(KafkaProducer).mockClear()
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
        [
          "with no sponsors",
          {
            data: omit(getNewCourse(), "sponsors"),
            expected: omit(expectedAddedCourse, "sponsors"),
          },
        ],
      ]

      test.each(cases)(
        "creates a course %s",
        async (_, { data, expected, omitIdFields = [] }) => {
          const res = await ctx.client.request<any>(
            createCourseMutation,
            {
              course: data,
            },
            FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
          )

          expect(res.addCourse).toMatchStrippedSnapshot(expected, {
            excludePaths: ["tags.id", "sponsors.id"],
          })

          expect(KafkaProducer).toHaveBeenCalledTimes(1)

          const createdCourse = await ctx.prisma.course.findUnique({
            where: { slug: "new1" },
            include: courseInclude,
          })

          expect(
            jest.mocked(KafkaProducer).mock.instances[0].queueProducerMessage,
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
                // graphql-request removed support for file uploads
                /*photo: {
                  ...anyPhoto.photo,
                  original: expect.stringContaining("image.gif"),
                },*/
                photo_id: null,
                ...noPhoto,
              }),
            },
            {
              idFields: ["id", "course_id" /*, "photo_id"*/].filter(
                (f) => !omitIdFields.includes(f),
              ),
              excludePaths: ["tags.id", "sponsors.id"],
            },
          )
        },
      )

      it("errors with non-admin", async () => {
        try {
          await ctx.client.request(
            createCourseMutation,
            {
              course: getNewCourse(),
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )
          fail()
        } catch {}
      })
    })

    describe("updateCourse", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("errors on no slug given", async () => {
        try {
          await ctx.client.request(
            updateCourseMutation,
            {
              course: omit(getUpdateCourse(), "slug"),
            },
            FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
          )
          fail()
        } catch {}
      })

      it("updates course", async () => {
        const res = await ctx.client.request<any>(
          updateCourseMutation,
          {
            course: {
              ...getUpdateCourse(),
              new_photo: undefined,
            },
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            ...expectedUpdatedCourse,
            photo: {
              ...anyPhoto.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id", "sponsors.id"],
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
        const res = await ctx.client.request<any>(
          updateCourseMutation,
          {
            course: {
              ...getUpdateCourse(),
              new_photo: undefined,
              new_slug: "course1",
              language: "fi",
            },
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )
        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            ...expectedUpdatedCourse,
            // graphql-request removed support for file uploads
            photo: {
              ...anyPhoto.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id", "sponsors.id"],
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
            excludePaths: ["id", "study_modules", "tags.id", "sponsors.id"],
          },
        )
      })

      it("removes language tag", async () => {
        const res = await ctx.client.request<any>(
          updateCourseMutation,
          {
            course: {
              ...getUpdateCourse(),
              new_photo: undefined,
              new_slug: "course1",
              language: undefined,
            },
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )
        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            ...expectedUpdatedCourse,
            photo: {
              ...anyPhoto.photo,
              original: expect.stringContaining("original.gif"),
            },
          },
          {
            excludePaths: ["id", "study_modules", "tags.id", "sponsors.id"],
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
            excludePaths: ["id", "study_modules", "tags.id", "sponsors.id"],
          },
        )
      })

      // graphql-request removed file upload support
      it.skip("updates photo", async () => {
        const res = await ctx.client.request<any>(
          updateCourseMutation,
          {
            course: getUpdateCourse(),
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            // graphql-request removed support for file uploads
            /*photo: {
              ...anyPhoto.photo,
            },*/
          },
          {
            excludePaths: ["id", "study_modules", "tags.id", "sponsors.id"],
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
            // graphql-request removed support for file uploads
            /*photo_id: expect.not.stringContaining(
              "00000000000000000000000000001101",
            ),*/
          },
          {
            excludePaths: ["tags.id", "sponsors.id"],
          },
        )
      })

      it("deletes photo", async () => {
        const res = await ctx.client.request<any>(
          updateCourseMutation,
          {
            course: {
              ...getUpdateCourse(),
              new_photo: undefined,
              new_slug: undefined,
              delete_photo: true,
            },
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(res.updateCourse).toMatchStrippedSnapshot(
          {
            ...expectedUpdatedCourse,
            photo: null,
          },
          { excludePaths: ["tags.id", "sponsors.id"] },
        )
        const updatedCourse = await ctx.prisma.course.findUnique({
          where: { slug: "course1" },
          include: courseInclude,
        })
        expect(updatedCourse).toMatchStrippedSnapshot(
          {},
          { excludePaths: ["tags.id", "sponsors.id"] },
        )
      })

      it("errors with non-admin", async () => {
        try {
          await ctx.client.request(
            updateCourseMutation,
            {
              course: getUpdateCourse(),
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )
          fail()
        } catch {}
      })
    })

    describe("updateCourse as course owner", () => {
      const course1Id = "00000000-0000-0000-0000-000000000002"
      const course2Id = "00000000-0000-0000-0000-000000000001"
      const handlerId = "00000000-0000-0000-0000-000000000666"
      const course1PhotoId = "00000000-0000-0000-0000-000000001101"

      const getOwnedCourse = () => ({
        name: "course2",
        slug: "course2",
        teacher_in_charge_name: "teacher2",
        teacher_in_charge_email: "e@mail.com",
        start_date: "1900-01-01T00:00:00.000Z",
      })

      let templateId: string

      beforeEach(async () => {
        await seed(ctx.prisma)
        templateId = (
          await ctx.prisma.emailTemplate.create({ data: { name: "template" } })
        ).id
      })

      it("refuses redirecting completions_handled_by to an unowned course", async () => {
        const errors = await requestErrors(
          {
            ...getOwnedCourse(),
            completions_handled_by: "00000000000000000000000000000002",
          },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        expect(errors).toEqual([expect.stringContaining("only admins")])
        const course = await ctx.prisma.course.findUniqueOrThrow({
          where: { id: course2Id },
        })
        expect(course.completions_handled_by_id).toBeNull()
      })

      it.each([
        ["inherit_settings_from", () => course1Id],
        ["completion_email_id", () => templateId],
        ["course_stats_email_id", () => templateId],
      ])("refuses changing %s", async (field, getValue) => {
        const errors = await requestErrors(
          { ...getOwnedCourse(), [field]: getValue() },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        expect(errors).toEqual([expect.stringContaining(field)])
      })

      it("accepts unchanged links", async () => {
        await ctx.prisma.course.update({
          where: { id: course2Id },
          data: {
            completions_handled_by: { connect: { id: handlerId } },
            inherit_settings_from: { connect: { id: handlerId } },
            completion_email: { connect: { id: templateId } },
            course_stats_email: { connect: { id: templateId } },
          },
        })

        await ctx.client.request(
          updateLinksMutation,
          {
            course: {
              ...getOwnedCourse(),
              name: "renamed",
              completions_handled_by: handlerId,
              inherit_settings_from: handlerId.replace(/-/g, ""),
              completion_email_id: templateId,
              course_stats_email_id: null,
            },
          },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        const course = await ctx.prisma.course.findUniqueOrThrow({
          where: { id: course2Id },
        })
        expect(course).toMatchObject({
          name: "renamed",
          completions_handled_by_id: handlerId,
          inherit_settings_from_id: handlerId,
          completion_email_id: templateId,
          course_stats_email_id: templateId,
        })
      })

      it.each([null, ""])(
        "accepts unchanged empty links as %j",
        async (value) => {
          await ctx.client.request(
            updateLinksMutation,
            {
              course: {
                ...getOwnedCourse(),
                name: "renamed",
                completions_handled_by: value,
                inherit_settings_from: value,
                completion_email_id: value,
                course_stats_email_id: value,
                photo: value,
              },
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )

          const course = await ctx.prisma.course.findUniqueOrThrow({
            where: { id: course2Id },
          })
          expect(course.name).toEqual("renamed")
        },
      )

      it("lets admins change links", async () => {
        await ctx.client.request(
          updateLinksMutation,
          {
            course: {
              ...getOwnedCourse(),
              completions_handled_by: course1Id,
              inherit_settings_from: course1Id,
              completion_email_id: templateId,
              course_stats_email_id: templateId,
            },
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        const course = await ctx.prisma.course.findUniqueOrThrow({
          where: { id: course2Id },
        })
        expect(course).toMatchObject({
          completions_handled_by_id: course1Id,
          inherit_settings_from_id: course1Id,
          completion_email_id: templateId,
          course_stats_email_id: templateId,
        })
      })

      it("refuses deleting another course's photo", async () => {
        const errors = await requestErrors(
          { ...getOwnedCourse(), photo: course1PhotoId, delete_photo: true },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        expect(errors).toEqual([expect.stringContaining("photo")])
        const image = await ctx.prisma.image.findUnique({
          where: { id: course1PhotoId },
        })
        expect(image).not.toBeNull()
      })

      it("deletes the course's own photo regardless of the photo sent", async () => {
        const ownPhoto = await ctx.prisma.image.create({
          data: {
            original: "own.gif",
            original_mimetype: "image/gif",
            uncompressed: "own.jpeg",
            uncompressed_mimetype: "image/jpeg",
          },
        })
        await ctx.prisma.course.update({
          where: { id: course2Id },
          data: { photo: { connect: { id: ownPhoto.id } } },
        })

        await ctx.client.request(
          updateLinksMutation,
          {
            course: {
              ...getOwnedCourse(),
              photo: course1PhotoId,
              delete_photo: true,
            },
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(
          await ctx.prisma.image.findUnique({ where: { id: ownPhoto.id } }),
        ).toBeNull()
        expect(
          await ctx.prisma.image.findUnique({ where: { id: course1PhotoId } }),
        ).not.toBeNull()
      })
    })

    describe("updateCourse slug and alias collisions", () => {
      const getCourse1 = () => ({
        name: "course1",
        slug: "course1",
        teacher_in_charge_name: "teacher1",
        teacher_in_charge_email: "e@mail.com",
        start_date: "1900-01-01T00:00:00.000Z",
      })

      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("refuses a new slug that is another course's alias", async () => {
        const errors = await requestErrors(
          { ...getCourse1(), new_slug: "alias2" },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(errors).toEqual([expect.stringContaining("alias2")])
        expect(
          await ctx.prisma.course.findUnique({ where: { slug: "course1" } }),
        ).not.toBeNull()
      })

      it("refuses an alias that is another course's slug", async () => {
        const errors = await requestErrors(
          { ...getCourse1(), course_aliases: [{ course_code: "course2" }] },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(errors).toEqual([expect.stringContaining("course2")])
        expect(
          await ctx.prisma.courseAlias.findUnique({
            where: { course_code: "course2" },
          }),
        ).toBeNull()
      })

      it("refuses an alias that is another course's alias", async () => {
        const errors = await requestErrors(
          {
            ...getCourse1(),
            course_aliases: [
              {
                id: "67000000-0000-0000-0000-000000000001",
                course_code: "alias",
              },
              { course_code: "alias2" },
            ],
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(errors).toHaveLength(1)
        const alias = await ctx.prisma.courseAlias.findUniqueOrThrow({
          where: { course_code: "alias2" },
        })
        expect(alias.course_id).toEqual("00000000-0000-0000-0000-000000000001")
      })

      it("accepts an alias equal to the course's own slug", async () => {
        await ctx.client.request(
          updateLinksMutation,
          {
            course: {
              ...getCourse1(),
              course_aliases: [{ course_code: "course1" }],
            },
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        const alias = await ctx.prisma.courseAlias.findUniqueOrThrow({
          where: { course_code: "course1" },
        })
        expect(alias.course_id).toEqual("00000000-0000-0000-0000-000000000002")
      })
    })

    describe("deleteCourse", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("deletes course on id", async () => {
        const res = await ctx.client.request(
          deleteCourseMutation,
          {
            id: "00000000000000000000000000000002",
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

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
        const res = await ctx.client.request(
          deleteCourseMutation,
          {
            slug: "course1",
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(res).toMatchSnapshot()
        const deletedCourse = await ctx.prisma.course.findUnique({
          where: { slug: "course1" },
        })
        expect(deletedCourse).toBeNull()
      })

      it("errors with non-admin", async () => {
        try {
          await ctx.client.request(
            deleteCourseMutation,
            {
              slug: "course1",
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )
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
      sponsors {
        id
        name
        translations {
          name
          description
          link
          link_text
          language
        }
        images {
          type
          width
          height
          uri
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
      sponsors {
        id
        name
        translations {
          name
          description
          link
          link_text
          language
        }
        images {
          type
          width
          height
          uri
        }
      }
    }
  }
`

const deleteCourseMutation = gql`
  mutation deleteCourse($id: ID, $slug: String) {
    deleteCourse(id: $id, slug: $slug) {
      id
      slug
      name
    }
  }
`

const updateLinksMutation = gql`
  mutation updateCourseLinks($course: CourseUpsertArg!) {
    updateCourse(course: $course) {
      id
    }
  }
`

async function requestErrors(
  course: Record<string, unknown>,
  headers: Record<string, string>,
): Promise<Array<string> | undefined> {
  try {
    await ctx.client.request(updateLinksMutation, { course }, headers)
    return undefined
  } catch (e: any) {
    return e.response?.errors?.map(
      (error: { message: string }) => error.message,
    )
  }
}
