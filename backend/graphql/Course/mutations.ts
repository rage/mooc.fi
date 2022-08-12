import { UserInputError } from "apollo-server-express"
import { omit } from "lodash"
import { arg, extendType, idArg, nonNull, stringArg } from "nexus"

import { Course, Prisma } from "@prisma/client"

import { isAdmin } from "../../accessControl"
import { DatabaseInputError } from "../../bin/lib/errors"
import { Context } from "../../context"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { invalidate } from "../../services/redis"
import { convertUpdate } from "../../util/db-functions"
import { notEmpty } from "../../util/notEmpty"
import { deleteImage, uploadImage } from "../Image"

const isNotNull = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined

const nullToUndefined = <T>(value: T | null | undefined): T | undefined =>
  value ?? undefined

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
          new_photo,
          base64,
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
        } = course

        let photo = null

        if (new_photo) {
          const newImage = await uploadImage({
            ctx,
            file: new_photo,
            base64: base64 ?? false,
          })

          photo = newImage.id
        }

        if (study_modules?.some((s) => !s?.id && !s?.slug)) {
          throw new UserInputError("study modules must have id or slug")
        }

        const newCourse = await ctx.prisma.course.create({
          data: {
            ...omit(course, [
              "base64",
              "new_photo",
              "completion_email_id",
              "course_stats_email_id",
            ]),
            name: course.name ?? "",
            photo: !!photo ? { connect: { id: photo } } : undefined,
            course_translations: {
              create: course_translations?.filter(isNotNull),
            },
            study_modules: !!study_modules
              ? {
                  connect: study_modules.map((s) => ({
                    id: nullToUndefined(s?.id),
                  })),
                }
              : undefined,
            open_university_registration_links: {
              create: open_university_registration_links?.filter(isNotNull),
            },
            course_variants: { create: course_variants?.filter(isNotNull) },
            course_aliases: { create: course_aliases?.filter(isNotNull) },
            inherit_settings_from: !!inherit_settings_from
              ? { connect: { id: inherit_settings_from } }
              : undefined,
            completions_handled_by: !!completions_handled_by
              ? { connect: { id: completions_handled_by } }
              : undefined,
            user_course_settings_visibilities: {
              create: user_course_settings_visibilities?.filter(isNotNull),
            },
            // don't think these will be passed by parameter, but let's be sure
            completion_email: !!completion_email_id
              ? { connect: { id: completion_email_id } }
              : undefined,
            course_stats_email: !!course_stats_email_id
              ? { connect: { id: course_stats_email_id } }
              : undefined,
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
          new_photo,
          slug,
          new_slug,
          base64,
          course_translations,
          open_university_registration_links,
          course_variants,
          course_aliases,
          study_modules,
          completion_email_id,
          status,
          delete_photo,
          inherit_settings_from,
          completions_handled_by,
          user_course_settings_visibilities,
          course_stats_email_id,
        } = course
        let { end_date } = course

        if (!slug) {
          throw new Error("slug required for update course")
        }

        let photo = course.photo

        if (new_photo) {
          const newImage = await uploadImage({
            ctx,
            file: new_photo,
            base64: base64 ?? false,
          })
          if (photo && photo !== newImage.id) {
            // TODO: do something with return value
            await deleteImage({ ctx, id: photo })
          }
          photo = newImage.id
        }

        const existingCourse = await ctx.prisma.course.findUnique({
          where: { slug },
        })
        if (
          existingCourse?.status != status &&
          status === "Ended" &&
          end_date === ""
        ) {
          end_date = new Date().toLocaleDateString()
        }

        if (photo && delete_photo) {
          await deleteImage({ ctx, id: photo })
          photo = null
        }

        // FIXME: I know there's probably a better way to do this
        const translationMutation:
          | Prisma.CourseTranslationUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: course_translations,
          field: "course_translations",
        })

        const registrationLinkMutation:
          | Prisma.OpenUniversityRegistrationLinkUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: open_university_registration_links,
          field: "open_university_registration_links",
        })

        const courseVariantMutation:
          | Prisma.CourseVariantUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: course_variants,
          field: "course_variants",
        })

        const courseAliasMutation:
          | Prisma.CourseAliasUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: course_aliases,
          field: "course_aliases",
        })

        const userCourseSettingsVisibilityMutation:
          | Prisma.UserCourseSettingsVisibilityUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: user_course_settings_visibilities,
          field: "user_course_settings_visibilities",
        })

        const existingVisibilities = await ctx.prisma.course
          .findUnique({ where: { slug } })
          .user_course_settings_visibilities()
        for (const visibility of existingVisibilities) {
          await invalidate(
            "usercoursesettingscount",
            `${slug}-${visibility.language}`,
          )
        }

        // this had different logic so it's not done with the same helper
        const existingStudyModules = await ctx.prisma.course
          .findUnique({ where: { slug } })
          .study_modules()
        //const addedModules: StudyModuleWhereUniqueInput[] = pullAll(study_modules, existingStudyModules.map(module => module.id))
        const removedModuleIds =
          existingStudyModules
            ?.filter((module) => !getIds(study_modules).includes(module.id))
            .map((module) => ({ id: module.id })) ?? []
        const connectModules =
          study_modules?.map((s) => ({
            ...s,
            id: nullToUndefined(s?.id),
            slug: nullToUndefined(s?.slug),
          })) ?? []

        const studyModuleMutation:
          | Prisma.StudyModuleUpdateManyWithoutCoursesInput
          | undefined = study_modules
          ? {
              connect: connectModules.length ? connectModules : undefined,
              disconnect: removedModuleIds.length
                ? removedModuleIds
                : undefined,
            }
          : undefined

        const existingInherit = await ctx.prisma.course
          .findUnique({ where: { slug } })
          .inherit_settings_from()
        const inheritMutation = inherit_settings_from
          ? {
              connect: { id: inherit_settings_from },
            }
          : existingInherit
          ? {
              disconnect: true, // { id: existingInherit.id },
            }
          : undefined
        const existingHandled = await ctx.prisma.course
          .findUnique({ where: { slug } })
          .completions_handled_by()
        const handledMutation = completions_handled_by
          ? {
              connect: { id: completions_handled_by },
            }
          : existingHandled
          ? {
              disconnect: true, // { id: existingHandled.id },
            }
          : undefined

        const updatedCourse = await ctx.prisma.course.update({
          where: {
            id: nullToUndefined(id),
            slug,
          },
          data: convertUpdate({
            ...omit(course, [
              "id",
              "photo",
              "base64",
              "new_slug",
              "new_photo",
              "delete_photo",
              "completion_email_id",
              "course_stats_email_id",
            ]),
            slug: new_slug ?? slug,
            end_date,
            // FIXME: disconnect removed photos?
            photo: !!photo ? { connect: { id: photo } } : undefined,
            course_translations: translationMutation,
            study_modules: studyModuleMutation,
            open_university_registration_links: registrationLinkMutation,
            course_variants: courseVariantMutation,
            course_aliases: courseAliasMutation,
            completion_email: completion_email_id
              ? { connect: { id: completion_email_id } }
              : undefined,
            course_stats_email: course_stats_email_id
              ? { connect: { id: course_stats_email_id } }
              : undefined,
            inherit_settings_from: inheritMutation,
            completions_handled_by: handledMutation,
            user_course_settings_visibilities:
              userCourseSettingsVisibilityMutation,
          }),
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
      resolve: async (_, args, ctx: Context) => {
        const { id, slug } = args

        if (!id && !slug) {
          throw new UserInputError("must provide id or slug")
        }

        const photo = await ctx.prisma.course
          .findUnique({
            where: {
              id: id ?? undefined,
              slug: slug ?? undefined,
            },
          })
          .photo()

        if (photo) {
          await deleteImage({ ctx, id: photo.id })
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

type WithIdOrNull = { id?: string | null; [key: string]: any } | null
const getIds = (arr?: WithIdOrNull[] | null) => arr?.map((t) => t?.id) ?? []

function filterNotIncluded(arr1: WithIdOrNull[], arr2: WithIdOrNull[]) {
  const ids1 = getIds(arr1)
  const ids2 = getIds(arr2)

  const filtered = ids1.filter((id) => !ids2.includes(id)).filter(notEmpty)

  return filtered.map((id) => ({ id }))
}

interface ICreateMutation<T> {
  ctx: Context
  slug: string
  data?: T[] | null
  field: keyof Prisma.Prisma__CourseClient<Course>
}

const createMutation = async <T extends WithIdOrNull>({
  ctx,
  slug,
  data,
  field,
}: ICreateMutation<T>) => {
  if (!data) {
    return undefined
  }

  let existing: T[] | undefined

  try {
    // @ts-ignore: can't be arsed to do the typing, works
    existing = await ctx.prisma.course.findUnique({ where: { slug } })[field]()
  } catch (e: any) {
    throw new DatabaseInputError(`error creating mutation`, { field, slug }, e)
  }

  const newOnes = (data || [])
    .filter(hasNotId) // (t) => !t.id
    .map((t) => ({ ...t, id: undefined }))
  const updated = (data || [])
    .filter(hasId) // (t) => !!t.id)
    .map((t) => ({
      where: { id: t.id },
      data: t, //{ ...t, id: undefined },
    }))
  const removed = filterNotIncluded(existing!, data)

  return {
    create: newOnes.length ? newOnes : undefined,
    updateMany: updated.length ? updated : undefined,
    deleteMany: removed.length ? removed : undefined,
  }
}

const hasId = <T extends WithIdOrNull>(data: T): data is T & { id: string } =>
  Boolean(data?.id)
const hasNotId = <T extends WithIdOrNull>(data: T) => !hasId(data)
