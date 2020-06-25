import {
  course_translationUpdateManyWithoutCourse_courseTocourse_translationInput,
  open_university_registration_linkUpdateManyWithoutCourse_courseToopen_university_registration_linkInput,
  study_moduleUpdateManyWithoutCourseInput,
  course_variantUpdateManyWithoutCourse_courseTocourse_variantInput,
  course_aliasUpdateManyWithoutCourse_courseTocourse_aliasInput,
  user_course_settings_visibilityUpdateManyWithoutCourse_courseTouser_course_settings_visibilityInput,
  courseUpdateManyWithoutCourse_courseTocourse_completions_handled_byInput,
} from "@prisma/client"
import { stringArg, arg, idArg } from "@nexus/schema"
import KafkaProducer, { ProducerMessage } from "../../../services/kafkaProducer"
import { uploadImage, deleteImage } from "./image"
import { omit } from "lodash"
import { invalidate } from "../../../services/redis"
import { schema } from "nexus"
import { UserInputError } from "apollo-server-errors"
import { NexusContext } from "/context"
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
      type: "course",
      args: {
        course: arg({
          type: "CourseCreateArg",
          required: true,
        }),
      },
      resolve: async (_, { course }, ctx: NexusContext) => {
        const {
          // slug,
          new_photo,
          base64,
          course_translation,
          open_university_registration_link,
          course_variant,
          course_alias,
          study_module,
          inherit_settings_from,
          completions_handled_by,
          user_course_settings_visibility,
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

        if (study_module?.some((s) => !s.id && !s.slug)) {
          throw new UserInputError("study modules must have id or slug")
        }

        const newCourse = await ctx.db.course.create({
          data: {
            ...omit(course, ["base64", "new_photo"]),
            name: course.name ?? "",
            image: !!photo ? { connect: { id: photo } } : null,
            course_translation: !!course_translation
              ? { create: course_translation }
              : null,
            study_module: !!study_module
              ? {
                  connect: study_module.map((s) => ({
                    id: s.id ?? undefined,
                  })),
                }
              : null,
            open_university_registration_link: !!open_university_registration_link
              ? { create: open_university_registration_link }
              : null,
            course_variant: !!course_variant
              ? { create: course_variant }
              : null,
            course_alias: !!course_alias ? { create: course_alias } : null,
            other_course_courseTocourse_inherit_settings_from: !!inherit_settings_from
              ? { connect: { id: inherit_settings_from } }
              : null,
            other_course_courseTocourse_completions_handled_by: !!completions_handled_by
              ? { connect: { id: completions_handled_by } }
              : null,
            user_course_settings_visibility: !!user_course_settings_visibility
              ? { create: user_course_settings_visibility }
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
      type: "course",
      args: {
        course: arg({
          type: "CourseUpsertArg",
          required: true,
        }),
      },
      resolve: async (_, { course }, ctx: NexusContext) => {
        console.log("I got this kind of thing", course)
        const {
          id,
          new_photo,
          slug,
          new_slug,
          base64,
          course_translation,
          open_university_registration_link,
          course_variant,
          course_alias,
          study_module,
          completion_email,
          status,
          delete_photo,
          inherit_settings_from,
          completions_handled_by,
          user_course_settings_visibility,
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
          | course_translationUpdateManyWithoutCourse_courseTocourse_translationInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: course_translation,
          field: "course_translation",
        })

        const registrationLinkMutation:
          | open_university_registration_linkUpdateManyWithoutCourse_courseToopen_university_registration_linkInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: open_university_registration_link,
          field: "open_university_registration_link",
        })

        const courseVariantMutation:
          | course_variantUpdateManyWithoutCourse_courseTocourse_variantInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: course_variant,
          field: "course_variant",
        })

        const courseAliasMutation:
          | course_aliasUpdateManyWithoutCourse_courseTocourse_aliasInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: course_alias,
          field: "course_alias",
        })

        const userCourseSettingsVisibilityMutation:
          | user_course_settings_visibilityUpdateManyWithoutCourse_courseTouser_course_settings_visibilityInput
          | undefined = await createMutation({
          ctx,
          slug,
          data: user_course_settings_visibility,
          field: "user_course_settings_visibility",
        })

        const existingVisibilities = await ctx.db.course
          .findOne({ where: { slug } })
          .user_course_settings_visibility()
        existingVisibilities?.forEach((visibility) =>
          invalidate(
            "usercoursesettingscount",
            `${slug}-${visibility.language}`,
          ),
        )

        // this had different logic so it's not done with the same helper
        const existingStudyModules = await ctx.db.course
          .findOne({ where: { slug } })
          .study_module()
        //const addedModules: StudyModuleWhereUniqueInput[] = pullAll(study_modules, existingStudyModules.map(module => module.id))
        const removedModuleIds = (existingStudyModules || [])
          .filter((module) => !getIds(study_module ?? []).includes(module.id))
          .map((module) => ({ id: module.id } as { id: string }))
        const connectModules =
          study_module?.map((s) => ({
            ...s,
            id: s.id ?? undefined,
            slug: s.slug ?? undefined,
          })) ?? []

        const studyModuleMutation:
          | study_moduleUpdateManyWithoutCourseInput
          | undefined = study_module
          ? {
              connect: connectModules.length ? connectModules : undefined,
              disconnect: removedModuleIds.length
                ? removedModuleIds
                : undefined,
            }
          : undefined

        const existingInherit = await ctx.db.course
          .findOne({ where: { slug } })
          .course_courseTocourse_inherit_settings_from()
        const inheritMutation = inherit_settings_from
          ? {
              connect: { id: inherit_settings_from },
            }
          : existingInherit
          ? {
              disconnect: { id: existingInherit.id },
            }
          : undefined
        const existingHandled = await ctx.db.course
          .findOne({ where: { slug } })
          .course_courseTocourse_completions_handled_by()
        const handledMutation:
          | courseUpdateManyWithoutCourse_courseTocourse_completions_handled_byInput
          | undefined = completions_handled_by
          ? {
              connect: { id: completions_handled_by },
            }
          : existingHandled
          ? {
              disconnect: { id: existingHandled.id },
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
            image: !!photo ? { connect: { id: photo } } : undefined,
            course_translation: translationMutation,
            study_module: studyModuleMutation,
            open_university_registration_link: registrationLinkMutation,
            course_variant: courseVariantMutation,
            course_alias: courseAliasMutation,
            email_template: completion_email
              ? { connect: { id: completion_email } }
              : undefined,
            other_course_courseTocourse_inherit_settings_from: inheritMutation,
            other_course_courseTocourse_completions_handled_by: handledMutation,
            user_course_settings_visibility: userCourseSettingsVisibilityMutation,
          },
        })

        return updatedCourse
      },
    })

    t.field("deleteCourse", {
      type: "course",
      args: {
        id: idArg(),
        slug: stringArg(),
      },
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
          .image()

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
  field: string
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
