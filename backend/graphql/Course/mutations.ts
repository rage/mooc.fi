import { UserInputError } from "apollo-server-express"
import { omit } from "lodash"
import { arg, extendType, idArg, nonNull, stringArg } from "nexus"

import { Prisma } from "@prisma/client"

import { isAdmin } from "../../accessControl"
import { Context } from "../../context"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { invalidate } from "../../services/redis"
import { createCourseMutations, getIds } from "../../util/courseMutationHelpers"
import { convertUpdate } from "../../util/db-functions"
import { isNotNullOrUndefined } from "../../util/isNullOrUndefined"
import { deleteImage, uploadImage } from "../Image"

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
          completion_email,
          course_stats_email,
          course_tags,
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
            ...omit(course, ["base64", "new_photo"]),
            name: course.name ?? "",
            photo: !!photo ? { connect: { id: photo } } : undefined,
            course_translations: {
              create: course_translations?.filter(isNotNullOrUndefined),
            },
            study_modules: !!study_modules
              ? {
                  connect: study_modules.map((s) => ({
                    id: s?.id ?? undefined,
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
            completion_email: !!completion_email
              ? { connect: { id: completion_email } }
              : undefined,
            course_stats_email: !!course_stats_email
              ? { connect: { id: course_stats_email } }
              : undefined,
            course_tags: { create: course_tags ?? undefined },
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
          study_modules,
          completion_email,
          status,
          delete_photo,
          inherit_settings_from,
          completions_handled_by,
          course_stats_email,
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

        const updatedFields = await createCourseMutations(
          ctx,
          slug,
        )([
          "course_translations",
          "open_university_registration_links",
          "course_variants",
          "course_aliases",
          "user_course_settings_visibilities",
          { name: "course_tags", id: "tag_id" },
        ])(course)

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
        const removedModuleIds = (existingStudyModules || [])
          .filter((module) => !getIds(study_modules ?? []).includes(module.id))
          .map((module) => ({ id: module.id } as { id: string }))
        const connectModules =
          study_modules?.map((s) => ({
            ...s,
            id: s?.id ?? undefined,
            slug: s?.slug ?? undefined,
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
            id: id ?? undefined,
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
            ]),
            slug: new_slug ? new_slug : slug,
            end_date,
            // FIXME: disconnect removed photos?
            ...updatedFields,
            photo: !!photo ? { connect: { id: photo } } : undefined,
            study_modules: studyModuleMutation,
            completion_email: completion_email
              ? { connect: { id: completion_email } }
              : undefined,
            course_stats_email: course_stats_email
              ? { connect: { id: course_stats_email } }
              : undefined,
            inherit_settings_from: inheritMutation,
            completions_handled_by: handledMutation,
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
