import {
  Prisma,
  Course,
  CourseTranslationUpdateManyWithoutCourseInput,
  OpenUniversityRegistrationLinkUpdateManyWithoutCourseInput,
  Image,
  StudyModuleUpdateManyWithoutCoursesInput,
  StudyModuleWhereUniqueInput,
  CourseCreateInput,
  CourseUpdateInput,
  CourseVariantUpdateManyWithoutCourseInput,
  CourseAliasUpdateManyWithoutCourseInput,
  CourseUpdateOneWithoutCompletions_handled_byInput,
} from "/generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, arg, idArg, booleanArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { uploadImage, deleteImage } from "./image"
import { omit } from "lodash"
import { NexusGenRootTypes } from "/generated/nexus"
import { CourseUpdateOneWithoutInherit_settings_fromInput } from "/generated/nexus-prisma/nexus-prisma"
import { invalidate } from "../../services/redis"

// for debug
/* const shallowCompare = (obj1: object, obj2: object) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key],
  ) */

const addCourse = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourse", {
    type: "Course",
    args: {
      course: arg({
        type: "CourseArg",
        required: true,
      }),
    },
    resolve: async (_, { course }, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })

      const {
        new_photo,
        base64,
        course_translations,
        open_university_registration_links,
        course_variants,
        course_aliases,
        study_modules,
        inherit_settings_from,
        completions_handled_by,
        has_visible_user_count,
      } = course

      const prisma: Prisma = ctx.prisma

      let photo = null

      if (new_photo) {
        const newImage = await uploadImage({
          prisma,
          file: new_photo,
          base64: base64 ?? false,
        })

        photo = newImage.id
      }

      const newCourse: Course = await prisma.createCourse({
        ...omit(course, [
          "id",
          "base64",
          "new_slug",
          "new_photo",
          "delete_photo",
          "has_visible_user_count",
        ]),
        photo: !!photo ? { connect: { id: photo } } : null,
        course_translations: !!course_translations
          ? { create: course_translations }
          : null,
        study_modules: !!study_modules ? { connect: study_modules } : null,
        open_university_registration_links: !!open_university_registration_links
          ? { create: open_university_registration_links }
          : null,
        course_variants: !!course_variants ? { create: course_variants } : null,
        course_aliases: !!course_aliases ? { create: course_aliases } : null,
        inherit_settings_from: !!inherit_settings_from
          ? { connect: { id: inherit_settings_from } }
          : null,
        completions_handled_by: !!completions_handled_by
          ? { connect: { id: completions_handled_by } }
          : null,
        user_course_settings_visibility: {
          create: { visible: has_visible_user_count ?? false },
        },
      } as CourseCreateInput)

      const kafkaProducer = await new KafkaProducer()
      const producerMessage: ProducerMessage = {
        message: JSON.stringify(newCourse),
        partition: null,
        topic: "new-course",
      }
      await kafkaProducer.queueProducerMessage(producerMessage)
      await kafkaProducer.disconnect()

      return newCourse as NexusGenRootTypes["Course"]
    },
  })
}

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
  prisma: Prisma
  slug: string
  data?: T[] | null
  field: string
}

const createMutation = async <T extends { id?: string | null }>({
  prisma,
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
    existing = await prisma.course({ slug })[field]()
  } catch (e) {
    throw new Error(`error creating mutation ${field} for course ${slug}: ${e}`)
  }

  const newOnes = (data || []).filter((t) => !t.id)
  const updated = (data || [])
    .filter((t) => !!t.id)
    .map((t) => ({ where: { id: t.id }, data: { ...t, id: undefined } }))
  const removed = filterNotIncluded(existing!, data)

  return {
    create: newOnes.length ? newOnes : undefined,
    updateMany: updated.length ? updated : undefined,
    deleteMany: removed.length ? removed : undefined,
  }
}

const updateCourse = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("updateCourse", {
    type: "Course",
    args: {
      course: arg({
        type: "CourseArg",
        required: true,
      }),
    },
    resolve: async (_, { course }, ctx) => {
      checkAccess(ctx)

      const prisma: Prisma = ctx.prisma
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
        has_visible_user_count,
      } = course
      let { end_date } = course
      if (!slug) {
        throw new Error("slug required for update course")
      }

      let photo = course.photo

      if (new_photo) {
        const newImage = await uploadImage({
          prisma,
          file: new_photo,
          base64: base64 ?? false,
        })
        if (photo && photo !== newImage.id) {
          // TODO: do something with return value
          await deleteImage({ prisma, id: photo })
        }
        photo = newImage.id
      }

      const existingCourse = await prisma.course({ slug })
      if (
        existingCourse?.status != status &&
        status === "Ended" &&
        end_date === ""
      ) {
        end_date = new Date().toLocaleDateString()
      }

      if (photo && delete_photo) {
        await deleteImage({ prisma, id: photo })
        photo = null
      }

      // FIXME: I know there's probably a better way to do this
      const translationMutation:
        | CourseTranslationUpdateManyWithoutCourseInput
        | undefined = await createMutation({
        prisma,
        slug,
        data: course_translations,
        field: "course_translations",
      })

      const registrationLinkMutation:
        | OpenUniversityRegistrationLinkUpdateManyWithoutCourseInput
        | undefined = await createMutation({
        prisma,
        slug,
        data: open_university_registration_links,
        field: "open_university_registration_links",
      })

      const courseVariantMutation:
        | CourseVariantUpdateManyWithoutCourseInput
        | undefined = await createMutation({
        prisma,
        slug,
        data: course_variants,
        field: "course_variants",
      })

      const courseAliasMutation:
        | CourseAliasUpdateManyWithoutCourseInput
        | undefined = await createMutation({
        prisma,
        slug,
        data: course_aliases,
        field: "course_aliases",
      })

      // this had different logic so it's not done with the same helper
      const existingStudyModules = await prisma.course({ slug }).study_modules()
      //const addedModules: StudyModuleWhereUniqueInput[] = pullAll(study_modules, existingStudyModules.map(module => module.id))
      const removedModuleIds: StudyModuleWhereUniqueInput[] = (
        existingStudyModules || []
      )
        .filter((module) => !getIds(study_modules ?? []).includes(module.id))
        .map((module) => ({ id: module.id }))
      const studyModuleMutation:
        | StudyModuleUpdateManyWithoutCoursesInput
        | undefined = study_modules
        ? {
            connect: study_modules,
            disconnect: removedModuleIds,
          }
        : undefined

      const existingInherit = await prisma
        .course({ slug })
        .inherit_settings_from()
      const inheritMutation:
        | CourseUpdateOneWithoutInherit_settings_fromInput
        | undefined = inherit_settings_from
        ? {
            connect: { id: inherit_settings_from },
          }
        : existingInherit
        ? {
            disconnect: true,
          }
        : undefined
      const existingHandled = await prisma
        .course({ slug })
        .completions_handled_by()
      const handledMutation:
        | CourseUpdateOneWithoutCompletions_handled_byInput
        | undefined = completions_handled_by
        ? {
            connect: { id: completions_handled_by },
          }
        : existingHandled
        ? {
            disconnect: true,
          }
        : undefined

      const existingVisibility = await prisma
        .course({ slug })
        .user_course_settings_visibility()
      const visibilityMutation = existingVisibility
        ? existingVisibility.visible !== has_visible_user_count
          ? {
              update: {
                visible: has_visible_user_count,
              },
            }
          : undefined
        : {
            create: {
              visible: has_visible_user_count,
            },
          }

      if (existingVisibility) {
        invalidate("usercoursesettingsvisibility", slug)
      }

      const updatedCourse = await prisma.updateCourse({
        where: {
          id,
          slug,
        },
        data: {
          ...omit(course, [
            "id",
            "base64",
            "new_slug",
            "new_photo",
            "delete_photo",
            "has_visible_user_count",
          ]),
          slug: new_slug ? new_slug : slug,
          end_date,
          // FIXME: disconnect removed photos?
          photo: !!photo ? { connect: { id: photo } } : null,
          course_translations: translationMutation /*Object.keys(translationMutation).length
            ? translationMutation
            : null,*/,
          study_modules: studyModuleMutation /*Object.keys(studyModuleMutation).length
            ? studyModuleMutation
            : null,*/,
          open_university_registration_links: registrationLinkMutation /*Object.keys(
            registrationLinkMutation,
          ).length
            ? registrationLinkMutation
            : null,*/,
          course_variants: courseVariantMutation /*Object.keys(courseVariantMutation).length
            ? courseVariantMutation
            : null,*/,
          course_aliases: courseAliasMutation /*Object.keys(courseAliasMutation).length
            ? courseAliasMutation
            : null,*/,
          completion_email: completion_email
            ? { connect: { id: completion_email } }
            : undefined,
          inherit_settings_from: inheritMutation,
          completions_handled_by: handledMutation,
          user_course_settings_visibility: visibilityMutation,
        } as CourseUpdateInput,
      })

      return updatedCourse as NexusGenRootTypes["Course"]
    },
  })
}

const deleteCourse = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteCourse", {
    type: "Course",
    args: {
      id: idArg({ required: false }),
      slug: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const prisma: Prisma = ctx.prisma
      const { id, slug } = args

      const photo: Image = await prisma.course({ id, slug }).photo()

      if (photo) {
        await deleteImage({ prisma, id: photo.id })
      }

      if (!id && !slug) {
        throw "must have id or slug"
      }

      const deletedCourse = await prisma.deleteCourse({
        id,
        slug,
      })

      return deletedCourse as NexusGenRootTypes["Course"]
    },
  })
}

const upsertUserCourseSettingsVisiblity = async (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  t.field("upsertUsercourseSettingsVisibility", {
    type: "UserCourseSettingsVisibility",
    args: {
      slug: stringArg({ required: true }),
      visible: booleanArg({ required: true }),
    },
    resolve: async (_, { slug, visible }, ctx) => {
      checkAccess(ctx)
      const { prisma } = ctx

      const existing = await prisma.userCourseSettingsVisibilities({
        where: { course: { slug } },
      })

      if (!existing || existing?.length === 0) {
        return prisma.createUserCourseSettingsVisibility({
          course: { connect: { slug } },
          visible,
        })
      }

      return prisma.updateUserCourseSettingsVisibility({
        where: { id: existing[0].id },
        data: {
          visible,
        },
      })
    },
  })
}

const addCourseMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addCourse(t)
  updateCourse(t)
  deleteCourse(t)
  upsertUserCourseSettingsVisiblity(t)
}

export default addCourseMutations
