import {
  Prisma,
  Course,
  CourseTranslationUpdateManyWithoutCourseInput,
  CourseTranslationCreateWithoutCourseInput,
  CourseTranslationUpdateManyWithWhereNestedInput,
  CourseTranslationScalarWhereInput,
  OpenUniversityRegistrationLinkUpdateManyWithoutCourseInput,
  OpenUniversityRegistrationLinkCreateWithoutCourseInput,
  OpenUniversityRegistrationLinkUpdateManyWithWhereNestedInput,
  Image,
  StudyModuleUpdateManyWithoutCoursesInput,
  StudyModuleWhereUniqueInput,
  CourseCreateInput,
  CourseUpdateInput,
} from "/generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg, idArg, intArg, floatArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { uploadImage, deleteImage } from "./image"
import { omit } from "lodash"

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
        study_modules,
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
        ...omit(course, ["id", "base64", "new_slug", "new_photo"]),
        photo: !!photo ? { connect: { id: photo } } : null,
        course_translations: !!course_translations
          ? { create: course_translations }
          : null,
        study_modules: !!study_modules ? { connect: study_modules } : null,
        open_university_registration_links: !!open_university_registration_links
          ? { create: open_university_registration_links }
          : null,
      } as CourseCreateInput)

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
}

const getIds = (arr: any[]) => (arr || []).map(t => t.id)
const filterNotIncluded = (arr1: any[], arr2: any[], mapToId = true) => {
  const ids1 = getIds(arr1)
  const ids2 = getIds(arr2)

  const filtered = ids1.filter(id => !ids2.includes(id))

  if (mapToId) {
    return filtered.map(id => ({ id }))
  }

  return filtered
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
        study_modules,
      } = course

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

      // FIXME: I know there's probably a better way to do this
      const existingTranslations = await prisma
        .course({ slug })
        .course_translations()
      const newTranslations: CourseTranslationCreateWithoutCourseInput[] = (
        course_translations || []
      ).filter(t => !t.id)
      const updatedTranslations: CourseTranslationUpdateManyWithWhereNestedInput[] = (
        course_translations || []
      )
        .filter(t => !!t.id)
        .map(t => ({ where: { id: t.id }, data: { ...t, id: undefined } }))
      const removedTranslationIds: CourseTranslationScalarWhereInput[] = filterNotIncluded(
        existingTranslations,
        course_translations ?? [],
      )

      const translationMutation: CourseTranslationUpdateManyWithoutCourseInput = {
        create: newTranslations.length ? newTranslations : undefined,
        updateMany: updatedTranslations.length
          ? updatedTranslations
          : undefined,
        deleteMany: removedTranslationIds.length
          ? removedTranslationIds
          : undefined,
      }

      const existingRegistrationLinks = await prisma
        .course({ slug })
        .open_university_registration_links()
      const newRegistrationLinks: OpenUniversityRegistrationLinkCreateWithoutCourseInput[] = (
        open_university_registration_links || []
      ).filter(t => !t.id)
      const updatedRegistrationLinks: OpenUniversityRegistrationLinkUpdateManyWithWhereNestedInput[] = (
        open_university_registration_links || []
      )
        .filter(t => !!t.id)
        .map(t => ({ where: { id: t.id }, data: { ...t, id: undefined } }))
      const removedRegistrationLinkIds = filterNotIncluded(
        existingRegistrationLinks,
        open_university_registration_links ?? [],
      )

      const registrationLinkMutation: OpenUniversityRegistrationLinkUpdateManyWithoutCourseInput = {
        create: newRegistrationLinks.length ? newRegistrationLinks : undefined,
        updateMany: updatedRegistrationLinks.length
          ? updatedRegistrationLinks
          : undefined,
        deleteMany: removedRegistrationLinkIds.length
          ? removedRegistrationLinkIds
          : undefined,
      }

      const existingStudyModules = await prisma.course({ slug }).study_modules()
      //const addedModules: StudyModuleWhereUniqueInput[] = pullAll(study_modules, existingStudyModules.map(module => module.id))
      const removedModuleIds: StudyModuleWhereUniqueInput[] = (
        existingStudyModules || []
      )
        .filter(module => !getIds(study_modules ?? []).includes(module.id))
        .map(module => ({ id: module.id }))
      const studyModuleMutation: StudyModuleUpdateManyWithoutCoursesInput = {
        connect: study_modules,
        disconnect: removedModuleIds,
      }

      return prisma.updateCourse({
        where: {
          id,
          slug,
        },
        data: {
          ...omit(course, ["base64", "new_Slug", "new_photo"]),
          slug: new_slug ? new_slug : slug,
          // FIXME: disconnect removed photos?
          photo: !!photo ? { connect: { id: photo } } : null,
          course_translations: Object.keys(translationMutation).length
            ? translationMutation
            : null,
          study_modules: Object.keys(studyModuleMutation).length
            ? studyModuleMutation
            : null,
          open_university_registration_links: Object.keys(
            registrationLinkMutation,
          ).length
            ? registrationLinkMutation
            : null,
        } as CourseUpdateInput,
      })
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

      return prisma.deleteCourse({
        id,
        slug,
      })
    },
  })
}

const addCourseMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addCourse(t)
  updateCourse(t)
  deleteCourse(t)
}

export default addCourseMutations
