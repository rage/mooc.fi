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
  OpenUniversityRegistrationLinkScalarWhereInput,
  Image,
  StudyModuleUpdateManyWithoutCoursesInput,
  StudyModuleWhereUniqueInput,
} from "/generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg, idArg, intArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"

import { uploadImage, deleteImage } from "./image"

const addCourse = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourse", {
    type: "Course",
    args: {
      name: stringArg(),
      slug: stringArg(),
      // photo: idArg(),
      new_photo: arg({ type: "Upload", required: false }),
      base64: booleanArg(),
      start_point: booleanArg(),
      promote: booleanArg(),
      hidden: booleanArg(),
      study_module_start_point: booleanArg(),
      status: arg({ type: "CourseStatus" }),
      study_modules: arg({
        type: "StudyModuleWhereUniqueInput",
        list: true,
      }),
      course_translations: arg({
        type: "CourseTranslationCreateWithoutCourseInput",
        list: true,
        required: false,
      }),
      open_university_registration_links: arg({
        type: "OpenUniversityRegistrationLinkCreateWithoutCourseInput",
        list: true,
        required: false,
      }),
      order: intArg(),
      study_module_order: intArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const {
        name,
        slug,
        start_point,
        hidden,
        study_module_start_point,
        new_photo,
        base64,
        promote,
        status,
        study_modules,
        course_translations,
        open_university_registration_links,
        order,
        study_module_order,
      } = args

      const prisma: Prisma = ctx.prisma

      let photo = null

      if (new_photo) {
        const newImage = await uploadImage({ prisma, file: new_photo, base64 })

        photo = newImage.id
      }

      const course: Course = await prisma.createCourse({
        name,
        slug,
        promote,
        start_point,
        hidden,
        study_module_start_point,
        photo: !!photo ? { connect: { id: photo } } : null,
        course_translations: !!course_translations
          ? { create: course_translations }
          : null,
        status,
        study_modules: !!study_modules ? { connect: study_modules } : null,
        open_university_registration_links: !!open_university_registration_links
          ? { create: open_university_registration_links }
          : null,
        order,
        study_module_order,
      })

      const kafkaProducer = await new KafkaProducer()
      const producerMessage: ProducerMessage = {
        message: JSON.stringify(course),
        partition: null,
        topic: "new-course",
      }
      await kafkaProducer.queueProducerMessage(producerMessage)
      await kafkaProducer.disconnect()
      return course
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
      id: idArg({ required: false }),
      name: stringArg(),
      slug: stringArg(),
      new_slug: stringArg(),
      photo: idArg(),
      new_photo: arg({ type: "Upload", required: false }),
      base64: booleanArg(),
      start_point: booleanArg(),
      promote: booleanArg(),
      hidden: booleanArg(),
      study_module_start_point: booleanArg(),
      status: arg({ type: "CourseStatus" }),
      study_modules: arg({
        type: "StudyModuleWhereUniqueInput",
        list: true,
      }),
      course_translations: arg({
        type: "CourseTranslationWithIdInput",
        list: true,
      }),
      open_university_registration_links: arg({
        type: "OpenUniversityRegistrationLinkWithIdInput",
        list: true,
      }),
      order: intArg(),
      study_module_order: intArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const prisma: Prisma = ctx.prisma
      const {
        id,
        name,
        slug,
        new_slug,
        new_photo,
        base64,
        start_point,
        promote,
        hidden,
        study_module_start_point,
        status,
        study_modules,
        course_translations,
        open_university_registration_links,
        order,
        study_module_order,
      } = args

      let photo = args.photo

      if (new_photo) {
        const newImage = await uploadImage({ prisma, file: new_photo, base64 })

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
        course_translations,
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
        open_university_registration_links,
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
      const removedModules: StudyModuleWhereUniqueInput[] = (
        existingStudyModules || []
      ).filter(module => !getIds(study_modules).includes(module.id))
      const studyModuleMutation: StudyModuleUpdateManyWithoutCoursesInput = {
        connect: study_modules,
        disconnect: removedModules,
      }

      return prisma.updateCourse({
        where: {
          id,
          slug,
        },
        data: {
          name,
          slug: new_slug ? new_slug : slug,
          photo: !!photo ? { connect: { id: photo } } : null,
          start_point,
          promote,
          hidden,
          status,
          study_module_start_point,
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
          order,
          study_module_order,
        },
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
