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
  CourseVariantCreateWithoutCourseInput,
  CourseUpdateInput,
  CourseTranslation,
  CourseVariantUpdateManyWithoutCourseInput,
} from "/generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg, idArg, intArg, floatArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"

import { uploadImage, deleteImage } from "./image"

// for debug
const shallowCompare = (obj1: object, obj2: object) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key],
  )

const addCourse = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourse", {
    type: "Course",
    args: {
      name: stringArg(),
      slug: stringArg(),
      ects: stringArg(),
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
      course_variants: arg({
        type: "CourseVariantCreateWithoutCourseInput",
        list: true,
        required: false,
      }),
      order: intArg(),
      study_module_order: intArg(),
      points_needed: intArg(),
      automatic_completions: booleanArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const {
        name,
        slug,
        ects,
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
        points_needed,
        automatic_completions,
        course_variants,
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
        ects,
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
        course_variants: !!course_variants ? { create: course_variants } : null,
        order,
        study_module_order,
        points_needed,
        automatic_completions,
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

interface ICreateMutation<T> {
  prisma: Prisma
  slug: string
  data: T[]
  field: string
}

const createMutation = async <T extends { id?: string }>({
  prisma,
  slug,
  data,
  field,
}: ICreateMutation<T>) => {
  const existing: T[] = await prisma.course({ slug })[field]()

  const newOnes = (data || []).filter(t => !t.id)
  const updated = (data || [])
    .filter(t => !!t.id)
    .map(t => ({ where: { id: t.id }, data: { ...t, id: undefined } }))
  const removed = filterNotIncluded(existing, data)

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
      id: idArg({ required: false }),
      name: stringArg(),
      slug: stringArg(),
      new_slug: stringArg(),
      ects: stringArg(),
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
      points_needed: intArg(),
      automatic_completions: booleanArg(),
      course_variants: arg({
        type: "CourseVariantWithIdInput",
        list: true,
      }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const prisma: Prisma = ctx.prisma
      const {
        id,
        name,
        slug,
        new_slug,
        ects,
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
        points_needed,
        automatic_completions,
        course_variants,
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
      const translationMutation: CourseTranslationUpdateManyWithoutCourseInput = await createMutation(
        {
          prisma,
          slug,
          data: course_translations,
          field: "course_translations",
        },
      )

      const registrationLinkMutation: OpenUniversityRegistrationLinkUpdateManyWithoutCourseInput = await createMutation(
        {
          prisma,
          slug,
          data: open_university_registration_links,
          field: "open_university_registration_links",
        },
      )

      const courseVariantMutation: CourseVariantUpdateManyWithoutCourseInput = await createMutation(
        {
          prisma,
          slug,
          data: course_variants,
          field: "course_variants",
        },
      )

      // this had different logic so it's not done with the same helper
      const existingStudyModules = await prisma.course({ slug }).study_modules()
      //const addedModules: StudyModuleWhereUniqueInput[] = pullAll(study_modules, existingStudyModules.map(module => module.id))
      const removedModuleIds: StudyModuleWhereUniqueInput[] = (
        existingStudyModules || []
      )
        .filter(module => !getIds(study_modules).includes(module.id))
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
          name,
          slug: new_slug ? new_slug : slug,
          ects,
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
          course_variants: Object.keys(courseVariantMutation).length
            ? courseVariantMutation
            : null,
          order,
          study_module_order,
          points_needed,
          automatic_completions,
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
