import {
  CourseTranslationUpdateManyWithoutCourseInput,
  OpenUniversityRegistrationLinkUpdateManyWithoutCourseInput,
  StudyModuleUpdateManyWithoutCoursesInput,
  CourseVariantUpdateManyWithoutCourseInput,
  CourseAliasUpdateManyWithoutCourseInput,
  UserCourseSettingsVisibilityUpdateManyWithoutCourseInput,
} from "@prisma/client"

import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { uploadImage, deleteImage } from "../Image"
import { omit } from "lodash"
import { invalidate } from "../../services/redis"
import { schema } from "nexus"
import { UserInputError } from "apollo-server-errors"
import { NexusContext } from "../../context"
import { isAdmin } from "../../accessControl"
import { Prisma__CourseClient, Course } from "nexus-plugin-prisma/client"
// for debug
/* const shallowCompare = (obj1: object, obj2: object) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key],
  ) */

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourse", {
      type: "Course",
      args: {
        course: schema.arg({
          type: "CourseCreateArg",
          required: true,
        }),
      },
      authorize: isAdmin,
      resolve: async (_, { course }, ctx: NexusContext) => {
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
          completion_email,
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

        if (study_modules?.some((s) => !s.id && !s.slug)) {
          throw new UserInputError("study modules must have id or slug")
        }

        const newCourse = await ctx.db.course.create({
          data: {
            ...omit(course, ["base64", "new_photo"]),
            name: course.name ?? "",
            photo: !!photo ? { connect: { id: photo } } : null,
            course_translations: !!course_translations
              ? { create: course_translations }
              : null,
            study_modules: !!study_modules
              ? {
                  connect: study_modules.map((s) => ({
                    id: s.id ?? undefined,
                  })),
                }
              : null,
            open_university_registration_links: !!open_university_registration_links
              ? { create: open_university_registration_links }
              : null,
            course_variants: !!course_variants
              ? { create: course_variants }
              : null,
            course_aliases: !!course_aliases
              ? { create: course_aliases }
              : null,
            inherit_settings_from: !!inherit_settings_from
              ? { connect: { id: inherit_settings_from } }
              : null,
            completions_handled_by: !!completions_handled_by
              ? { connect: { id: completions_handled_by } }
              : null,
            user_course_settings_visibilities: !!user_course_settings_visibilities
              ? { create: user_course_settings_visibilities }
              : null,
            // don't think this will be passed by parameter, but let's be sure
            completion_email: !!completion_email
              ? { connect: { id: completion_email } }
              : null,
          },
        })

        const kafkaProducer = await new KafkaProducer()
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
        course: schema.arg({
          type: "CourseUpsertArg",
          required: true,
        }),
      },
      authorize: isAdmin,
      resolve: async (_, { course }, ctx: NexusContext) => {
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
          completion_email,
          status,
          delete_photo,
          inherit_settings_from,
          completions_handled_by,
          user_course_settings_visibilities,
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

        const existingCourse = await ctx.db.course.findOne({ where: { slug } })
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
          | CourseTranslationUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: course_translations,
          field: "course_translations",
        })

        const registrationLinkMutation:
          | OpenUniversityRegistrationLinkUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: open_university_registration_links,
          field: "open_university_registration_links",
        })

        const courseVariantMutation:
          | CourseVariantUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: course_variants,
          field: "course_variants",
        })

        const courseAliasMutation:
          | CourseAliasUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: course_aliases,
          field: "course_aliases",
        })

        const userCourseSettingsVisibilityMutation:
          | UserCourseSettingsVisibilityUpdateManyWithoutCourseInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: user_course_settings_visibilities,
          field: "user_course_settings_visibilities",
        })

        const existingVisibilities = await ctx.db.course
          .findOne({ where: { slug } })
          .user_course_settings_visibilities()
        existingVisibilities?.forEach((visibility) =>
          invalidate(
            "usercoursesettingscount",
            `${slug}-${visibility.language}`,
          ),
        )

        // this had different logic so it's not done with the same helper
        const existingStudyModules = await ctx.db.course
          .findOne({ where: { slug } })
          .study_modules()
        //const addedModules: StudyModuleWhereUniqueInput[] = pullAll(study_modules, existingStudyModules.map(module => module.id))
        const removedModuleIds = (existingStudyModules || [])
          .filter((module) => !getIds(study_modules ?? []).includes(module.id))
          .map((module) => ({ id: module.id } as { id: string }))
        const connectModules =
          study_modules?.map((s) => ({
            ...s,
            id: s.id ?? undefined,
            slug: s.slug ?? undefined,
          })) ?? []

        const studyModuleMutation:
          | StudyModuleUpdateManyWithoutCoursesInput
          | undefined = study_modules
          ? {
              connect: connectModules.length ? connectModules : undefined,
              disconnect: removedModuleIds.length
                ? removedModuleIds
                : undefined,
            }
          : undefined

        const existingInherit = await ctx.db.course
          .findOne({ where: { slug } })
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
        const existingHandled = await ctx.db.course
          .findOne({ where: { slug } })
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

        const updatedCourse = await ctx.db.course.update({
          where: {
            id: id ?? undefined,
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
            ]),
            slug: new_slug ? new_slug : slug,
            end_date,
            // FIXME: disconnect removed photos?
            photo: !!photo ? { connect: { id: photo } } : undefined,
            course_translations: translationMutation,
            study_modules: studyModuleMutation,
            open_university_registration_links: registrationLinkMutation,
            course_variants: courseVariantMutation,
            course_aliases: courseAliasMutation,
            completion_email: completion_email
              ? { connect: { id: completion_email } }
              : undefined,
            inherit_settings_from: inheritMutation,
            completions_handled_by: handledMutation,
            user_course_settings_visibilities: userCourseSettingsVisibilityMutation,
          },
        })

        return updatedCourse
      },
    })

    t.field("deleteCourse", {
      type: "Course",
      args: {
        id: schema.idArg(),
        slug: schema.stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx: NexusContext) => {
        const { id, slug } = args

        if (!id && !slug) {
          throw new UserInputError("must provide id or slug")
        }

        const photo = await ctx.db.course
          .findOne({
            where: {
              id: id ?? undefined,
              slug: slug ?? undefined,
            },
          })
          .photo()

        if (photo) {
          await deleteImage({ ctx, id: photo.id })
        }

        const deletedCourse = await ctx.db.course.delete({
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

const getIds = (arr: any[]) => (arr || []).map((t) => t.id)
const filterNotIncluded = (arr1: any[], arr2: any[], mapToId = true) => {
  const ids1 = getIds(arr1)
  const ids2 = getIds(arr2)

  const filtered = ids1.filter((id) => !ids2.includes(id))

  if (mapToId) {
    return filtered.map((id) => ({ id }))
  }

  return filtered
}

interface ICreateMutation<T> {
  ctx: NexusContext
  slug: string
  data?: T[] | null
  field: keyof Prisma__CourseClient<Course>
}

const createMutation = async <T extends { id?: string | null }>({
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
    existing = await ctx.db.course.findOne({ where: { slug } })[field]()
  } catch (e) {
    throw new Error(`error creating mutation ${field} for course ${slug}: ${e}`)
  }

  const newOnes = (data || [])
    .filter((t) => !t.id)
    .map((t) => ({ ...t, id: undefined }))
  const updated = (data || [])
    .filter((t) => !!t.id)
    .map((t) => ({
      where: { id: t.id } as { id: string },
      data: { ...t, id: undefined },
    }))
  const removed = filterNotIncluded(existing!, data)

  return {
    create: newOnes.length ? newOnes : undefined,
    updateMany: updated.length ? updated : undefined,
    deleteMany: removed.length ? removed : undefined,
  }
}
