/* eslint-disable complexity */
import { UserInputError } from "apollo-server-express"
import { omit } from "lodash"
import { arg, extendType, idArg, nonNull, stringArg } from "nexus"
import { NexusGenInputs } from "nexus-typegen"

import { Course, CourseTag, Prisma, StudyModule } from "@prisma/client"

import { isAdmin } from "../../accessControl"
import { Context } from "../../context"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { invalidate } from "../../services/redis"
import {
  connectOrDisconnect,
  createCourseMutations,
  getIds,
} from "../../util/courseMutationHelpers"
import { isNotNullOrUndefined } from "../../util/isNullOrUndefined"
import { deleteImage, uploadImage } from "../Image"

const nullToUndefined = <T>(value: T | null | undefined): T | undefined =>
  value ?? undefined

const hasId = <T>(value: any): value is T & { id: string } => Boolean(value?.id)

export const CourseMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourse", {
      type: "Course",
      args: {
        course: nonNull(
          arg({
            type: "CourseCreateArg",
          }),
        ),
      },
      authorize: isAdmin,
      resolve: async (_, { course }, ctx: Context) => {
        const {
          // slug,
          course_translations,
          open_university_registration_links,
          course_variants,
          course_aliases,
          study_modules,
          inherit_settings_from,
          completions_handled_by,
          user_course_settings_visibilities,
          completion_email_id,
          course_stats_email_id,
          tags,
        } = course

        const photo = await updatePossibleNewPhoto(course, ctx)

        if (study_modules?.some((s) => !s?.id && !s?.slug)) {
          throw new UserInputError("study modules must have id or slug")
        }

        const newCourse = await ctx.prisma.course.create({
          data: {
            ...omit(course, [
              "base64",
              "new_photo",
              "tags",
              "completion_email_id",
              "course_stats_email_id",
            ]),
            name: course.name ?? "",
            photo: !!photo ? { connect: { id: photo } } : undefined,
            course_translations: {
              create: course_translations?.filter(isNotNullOrUndefined),
            },
            study_modules: !!study_modules
              ? {
                  connect: study_modules.map((s) => ({
                    id: nullToUndefined(s?.id),
                  })),
                }
              : undefined,
            open_university_registration_links: {
              create: open_university_registration_links ?? undefined,
            },
            course_variants: { create: course_variants ?? undefined },
            course_aliases: { create: course_aliases ?? undefined },
            inherit_settings_from: !!inherit_settings_from
              ? { connect: { id: inherit_settings_from } }
              : undefined,
            completions_handled_by: !!completions_handled_by
              ? { connect: { id: completions_handled_by } }
              : undefined,
            user_course_settings_visibilities: {
              create: user_course_settings_visibilities ?? undefined,
            },
            // don't think these will be passed by parameter, but let's be sure
            completion_email: !!completion_email_id
              ? { connect: { id: completion_email_id } }
              : undefined,
            course_stats_email: !!course_stats_email_id
              ? { connect: { id: course_stats_email_id } }
              : undefined,
            course_tags: {
              create: tags
                ?.map((tag) => tag.id)
                .filter(isNotNullOrUndefined)
                .map((id) => ({ tag: { connect: { id } } })),
            },
          },
        })

        const kafkaProducer = new KafkaProducer()
        const producerMessage: ProducerMessage = {
          message: JSON.stringify(newCourse),
          partition: null,
          topic: "new-course",
        }
        await kafkaProducer.queueProducerMessage(producerMessage)
        await kafkaProducer.disconnect()

        return newCourse
      },
    })

    t.field("updateCourse", {
      type: "Course",
      args: {
        course: nonNull(
          arg({
            type: "CourseUpsertArg",
          }),
        ),
      },
      authorize: isAdmin,
      resolve: async (_, { course }, ctx: Context) => {
        const {
          id,
          slug,
          new_slug,
          study_modules,
          completion_email_id,
          status,
          delete_photo,
          inherit_settings_from,
          completions_handled_by,
          course_stats_email_id,
          tags,
        } = course
        let { end_date } = course

        if (!slug) {
          throw new Error("slug required for update course")
        }

        let photo = await updatePossibleNewPhoto(course, ctx)

        const existingCourse = await ctx.prisma.course.findUnique({
          where: { slug },
          include: {
            study_modules: true,
            completions_handled_by: true,
            inherit_settings_from: true,
            user_course_settings_visibilities: true,
            course_tags: true,
          },
        })

        if (!existingCourse) {
          throw new UserInputError("course not found")
        }

        if (
          existingCourse.status != status &&
          status === "Ended" &&
          end_date !== ""
        ) {
          end_date = new Date().toLocaleDateString()
        }

        if (photo && delete_photo) {
          await deleteImage({ ctx, id: photo })
          photo = null
        }

        const updatedFields = await createCourseMutations(
          ctx,
          slug,
        )([
          "course_translations",
          "open_university_registration_links",
          "course_variants",
          "course_aliases",
          "user_course_settings_visibilities",
          //{ name: "course_tags", id: "tag_id" },
        ])(course)

        for (const visibility of existingCourse.user_course_settings_visibilities ??
          []) {
          await invalidate(
            "usercoursesettingscount",
            `${slug}-${visibility.language}`,
          )
        }

        const studyModuleMutation:
          | Prisma.StudyModuleUpdateManyWithoutCoursesInput
          | undefined = getStudyModuleMutation(existingCourse, study_modules)
        const inheritMutation = connectOrDisconnect(
          inherit_settings_from,
          existingCourse.inherit_settings_from,
        )
        const handledMutation = connectOrDisconnect(
          completions_handled_by,
          existingCourse.completions_handled_by,
        )
        const courseTagMutation = getCourseTagMutation(existingCourse, tags)

        const updatedCourse = await ctx.prisma.course.update({
          where: {
            id: nullToUndefined(id),
            slug,
          },
          data: {
            ...omit(course, [
              "id",
              "photo",
              "base64",
              "new_slug",
              "new_photo",
              "delete_photo",
              "completion_email_id",
              "course_stats_email_id",
              "tags",
            ]),
            slug: new_slug ?? slug,
            end_date,
            // FIXME: disconnect removed photos?
            ...updatedFields,
            photo: !!photo ? { connect: { id: photo } } : undefined,
            study_modules: studyModuleMutation,
            completion_email: completion_email_id
              ? { connect: { id: completion_email_id } }
              : undefined,
            course_stats_email: course_stats_email_id
              ? { connect: { id: course_stats_email_id } }
              : undefined,
            inherit_settings_from: inheritMutation,
            completions_handled_by: handledMutation,
            course_tags: courseTagMutation,
          },
        })

        return updatedCourse
      },
    })

    t.field("deleteCourse", {
      type: "Course",
      args: {
        id: idArg(),
        slug: stringArg(),
      },
      authorize: isAdmin,
      validate: (_, { id, slug }) => {
        if (!id && !slug) {
          throw new UserInputError("must provide id or slug")
        }
      },
      resolve: async (_, { id, slug }, ctx: Context) => {
        const existing = await ctx.prisma.course.findUnique({
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
          },
          include: {
            photo: true,
            course_tags: true,
          },
        })

        if (existing?.photo) {
          await deleteImage({ ctx, id: existing?.photo.id })
        }
        if (existing?.course_tags?.length) {
          // prisma won't allow cascade deletes until 2.26 and referentialActions
          await ctx.prisma.courseTag.deleteMany({
            where: {
              course_id: existing.id,
            },
          })
        }

        const deletedCourse = await ctx.prisma.course.delete({
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
          },
        })

        return deletedCourse
      },
    })
  },
})

async function updatePossibleNewPhoto(
  course: NexusGenInputs["CourseCreateArg"] | NexusGenInputs["CourseUpsertArg"],
  ctx: Context,
) {
  const { photo, new_photo, base64 } = course

  if (!new_photo) {
    return course.photo
  }

  const newImage = await uploadImage({
    ctx,
    file: new_photo,
    base64: base64 ?? false,
  })
  if (photo && photo !== newImage.id) {
    // TODO: do something with return value
    await deleteImage({ ctx, id: photo })
  }
  return newImage.id
}

function getCourseTagMutation<
  C extends Course & { course_tags: Array<CourseTag> },
>(
  existingCourse: C,
  tags?:
    | (
        | NexusGenInputs["CourseCreateArg"]
        | NexusGenInputs["CourseUpsertArg"]
      )["tags"]
    | null,
): Prisma.CourseTagUpdateManyWithoutCourseInput | undefined {
  if (!tags) {
    return
  }

  const removedTagIds =
    existingCourse.course_tags
      ?.filter((course_tag) => !getIds(tags ?? []).includes(course_tag.tag_id))
      .map((course_tag) => ({
        course_id: existingCourse.id,
        tag_id: course_tag.tag_id,
      })) ?? []
  const connectTags = (tags ?? []).filter(hasId).map((t) => ({
    course_id_tag_id: {
      course_id: existingCourse.id,
      tag_id: t.id,
    },
  }))

  return {
    connect: connectTags.length ? connectTags : undefined,
    deleteMany: removedTagIds.length ? removedTagIds : undefined,
    // can't just disconnect as it would violate null constraint on course_id
  }
}

function getStudyModuleMutation<
  C extends Course & { study_modules: Array<StudyModule> },
>(
  existingCourse: C,
  study_modules?:
    | (
        | NexusGenInputs["CourseCreateArg"]
        | NexusGenInputs["CourseUpsertArg"]
      )["study_modules"]
    | null,
): Prisma.StudyModuleUpdateManyWithoutCoursesInput | undefined {
  if (!study_modules) {
    return
  }

  const removedModuleIds =
    existingCourse.study_modules
      ?.filter((module) => !getIds(study_modules ?? []).includes(module.id))
      .map((module) => ({ id: module.id })) ?? []
  const connectModules =
    study_modules?.map((s) => ({
      ...s,
      id: nullToUndefined(s?.id),
      slug: nullToUndefined(s?.slug),
    })) ?? []

  return {
    connect: connectModules.length ? connectModules : undefined,
    disconnect: removedModuleIds.length ? removedModuleIds : undefined,
  }
}
