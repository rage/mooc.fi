/* eslint-disable complexity */
import { omit, uniqBy } from "lodash"
import { arg, extendType, idArg, nonNull, stringArg } from "nexus"
import { NexusGenInputs } from "nexus-typegen"

import { Course, CourseSponsor, Prisma, StudyModule, Tag } from "@prisma/client"

import { isAdmin, isAdminOrCourseOwner } from "../../accessControl"
import { Context } from "../../context"
import { GraphQLUserInputError } from "../../lib/errors"
import { invalidateAllGraphqlCachedQueries } from "../../middlewares/expressGraphqlCache"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { invalidate } from "../../services/redis"
import { emptyOrNullToUndefined, isDefined } from "../../util"
import {
  connectOrDisconnect,
  createCourseMutations,
  getIds,
} from "../../util/courseMutationHelpers"
import { deleteImage, uploadImage } from "../Image"

// @ts-ignore: not used for now
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
          course_variants,
          course_aliases,
          study_modules,
          inherit_settings_from,
          completions_handled_by,
          user_course_settings_visibilities,
          completion_email_id,
          course_stats_email_id,
          language,
          sponsors,
        } = course
        let tags = course.tags ?? []

        const photo = await updatePossibleNewPhoto(course, ctx)

        if (study_modules?.some((s) => !s?.id && !s?.slug)) {
          throw new GraphQLUserInputError("study modules must have id or slug")
        }

        if (language) {
          tags = uniqBy((tags ?? []).concat({ id: language }), "id")
        }

        const open_university_registration_links =
          course.open_university_registration_links?.map((link) => ({
            ...link,
            tiers: link.tiers ?? Prisma.JsonNull,
          })) ?? undefined

        const newCourse = await ctx.prisma.course.create({
          data: {
            ...omit(course, [
              "base64",
              "new_photo",
              "tags",
              "completions_handled_by",
              "inherit_settings_from",
              "study_modules",
              "completion_email_id",
              "course_stats_email_id",
            ]),
            start_date: course.start_date.toISOString(),
            end_date: course.end_date?.toISOString() ?? undefined,
            name: course.name ?? "",
            photo: photo ? { connect: { id: photo } } : undefined,
            course_translations: {
              create: course_translations?.filter(isDefined),
            },
            ...(!!study_modules && {
              study_modules: {
                connect: study_modules.map((s) => ({
                  id: emptyOrNullToUndefined(s?.id),
                })),
              },
            }),
            open_university_registration_links: {
              create: open_university_registration_links?.filter(isDefined),
            },
            course_variants: { create: course_variants?.filter(isDefined) },
            course_aliases: { create: course_aliases?.filter(isDefined) },
            ...(inherit_settings_from
              ? {
                  inherit_settings_from: {
                    connect: { id: inherit_settings_from },
                  },
                }
              : {}),
            ...(completions_handled_by
              ? {
                  completions_handled_by: {
                    connect: { id: completions_handled_by },
                  },
                }
              : {}),
            user_course_settings_visibilities: {
              create: user_course_settings_visibilities?.filter(isDefined),
            },
            // don't think these will be passed by parameter, but let's be sure
            ...(completion_email_id
              ? {
                  completion_email: { connect: { id: completion_email_id } },
                }
              : {}),
            ...(course_stats_email_id
              ? {
                  course_stats_email: {
                    connect: { id: course_stats_email_id },
                  },
                }
              : {}),
            tags: { connect: (tags ?? []).map((tag) => ({ id: tag.id })) },
            sponsors: {
              create: (sponsors ?? []).map((sponsor) => ({
                sponsor: {
                  connect: { id: sponsor.id },
                },
                order: sponsor.order ?? undefined,
              })),
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

        await invalidateAllGraphqlCachedQueries(ctx.logger).catch((e) => {
          ctx.logger.warn(
            `Failed to invalidate GraphQL cache after course creation: ${e}`,
          )
        })

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
      authorize: async (root, { course }, ctx, info) => {
        if (!course.slug) {
          return false
        }
        const existingCourse = await ctx.prisma.course.findUnique({
          where: { slug: course.slug },
          select: { id: true },
        })
        if (!existingCourse) {
          return false
        }
        return await isAdminOrCourseOwner(existingCourse.id)(
          root,
          { course },
          ctx,
          info,
        )
      },
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
          sponsors,
        } = course
        let { end_date } = course

        if (!slug) {
          throw new GraphQLUserInputError("slug required for update course")
        }

        let photo = await updatePossibleNewPhoto(course, ctx)

        const existingCourse = await ctx.prisma.course.findUnique({
          where: { slug },
          include: {
            study_modules: true,
            completions_handled_by: true,
            inherit_settings_from: true,
            user_course_settings_visibilities: true,
            tags: true,
            sponsors: true,
          },
        })

        if (!existingCourse) {
          throw new GraphQLUserInputError("course not found")
        }

        if (
          existingCourse.status !== status &&
          status === "Ended" &&
          !end_date
        ) {
          end_date = new Date()
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
        ])(omit(course, "sponsors"))

        for (const visibility of existingCourse.user_course_settings_visibilities ??
          []) {
          await invalidate(
            "usercoursesettingscount",
            `${slug}-${visibility.language}`,
          )
        }

        const studyModuleMutation:
          | Prisma.StudyModuleUpdateManyWithoutCoursesNestedInput
          | undefined = getStudyModuleMutation(existingCourse, study_modules)
        const inheritMutation = connectOrDisconnect(
          inherit_settings_from,
          existingCourse.inherit_settings_from,
        )
        const handledMutation = connectOrDisconnect(
          completions_handled_by,
          existingCourse.completions_handled_by,
        )
        const tagsMutation = getTagMutation(course, existingCourse, tags)
        const sponsorsMutation = getSponsorMutation(existingCourse, sponsors)
        const updatedCourse = await ctx.prisma.course.update({
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
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
            photo: photo ? { connect: { id: photo } } : undefined,
            study_modules: studyModuleMutation,
            completion_email: completion_email_id
              ? { connect: { id: completion_email_id } }
              : undefined,
            course_stats_email: course_stats_email_id
              ? { connect: { id: course_stats_email_id } }
              : undefined,
            inherit_settings_from: inheritMutation,
            completions_handled_by: handledMutation,
            tags: tagsMutation,
            sponsors: sponsorsMutation,
          },
        })

        await invalidateAllGraphqlCachedQueries(ctx.logger).catch((e) => {
          ctx.logger.warn(
            `Failed to invalidate GraphQL cache after course update: ${e}`,
          )
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
      authorize: async (root, { id, slug }, ctx, info) => {
        const course = await ctx.prisma.course.findUnique({
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
          },
          select: { id: true },
        })
        if (!course) {
          return false
        }
        return await isAdminOrCourseOwner(course.id)(
          root,
          { id, slug },
          ctx,
          info,
        )
      },
      validate: (_, { id, slug }) => {
        if (!id && !slug) {
          throw new GraphQLUserInputError("must provide id or slug")
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
            tags: true,
          },
        })

        if (existing?.photo) {
          await deleteImage({ ctx, id: existing?.photo.id })
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

function getTagMutation<C extends Course>(
  course: NexusGenInputs["CourseCreateArg"] | NexusGenInputs["CourseUpsertArg"],
  existingCourse: C & { tags: Array<Tag> },
  tags?:
    | (
        | NexusGenInputs["CourseCreateArg"]
        | NexusGenInputs["CourseUpsertArg"]
      )["tags"]
    | null,
): Prisma.TagUpdateManyWithoutCoursesNestedInput | undefined {
  const languageTags = (tags ?? []).filter(
    (tag) => tag.types?.includes("language"),
  )
  if (course.language) {
    if (languageTags.every((tag) => tag.id !== course.language)) {
      tags = [
        ...(tags ?? []),
        { id: course.language, hidden: false, types: ["language"] },
      ]
    }
  }
  if (existingCourse.language !== course.language) {
    tags = tags?.filter((tag) => tag.id !== existingCourse.language)
  }

  if (!tags) {
    return
  }

  const removedTagIds =
    existingCourse.tags
      ?.filter(
        (existingTag) =>
          !(tags ?? []).map((tag) => tag.id).includes(existingTag.id),
      )
      .map((tag) => ({
        id: tag.id,
      })) ?? []
  const connectTags = (tags ?? []).map((t) => ({ id: t.id }))

  return {
    connect: connectTags.length ? connectTags : undefined,
    disconnect: removedTagIds.length ? removedTagIds : undefined,
  }
}

function getSponsorMutation<C extends Course>(
  existingCourse: C & { sponsors: Array<CourseSponsor> },
  sponsors?:
    | (
        | NexusGenInputs["CourseCreateArg"]
        | NexusGenInputs["CourseUpsertArg"]
      )["sponsors"]
    | null,
): Prisma.CourseSponsorUpdateManyWithoutCourseNestedInput | undefined {
  const sponsorIds = getIds(sponsors ?? [])
  const newSponsors = (sponsors ?? []).filter(
    ({ id }) =>
      !existingCourse.sponsors.some(
        (courseSponsor) => id === courseSponsor.sponsor_id,
      ),
  )
  const removedSponsorIds =
    existingCourse.sponsors
      ?.filter(
        (courseSponsor) => !sponsorIds.includes(courseSponsor.sponsor_id),
      )
      .map((courseSponsor) => courseSponsor.sponsor_id) ?? []

  return {
    upsert: newSponsors.length
      ? newSponsors.map(({ id, order }) => ({
          where: {
            course_id_sponsor_id: {
              course_id: existingCourse.id,
              sponsor_id: id,
            },
          },
          create: {
            sponsor: { connect: { id } },
            order,
          },
          update: {
            order,
          },
        }))
      : undefined,
    deleteMany: removedSponsorIds.length
      ? { sponsor_id: { in: removedSponsorIds } }
      : undefined,
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
): Prisma.StudyModuleUpdateManyWithoutCoursesNestedInput | undefined {
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
      id: emptyOrNullToUndefined(s?.id),
      slug: emptyOrNullToUndefined(s?.slug),
    })) ?? []

  return {
    connect: connectModules.length ? connectModules : undefined,
    disconnect: removedModuleIds.length ? removedModuleIds : undefined,
  }
}
