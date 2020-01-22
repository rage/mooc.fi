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
} from "/generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, arg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { uploadImage, deleteImage } from "./image"
import { omit } from "lodash"
import { NexusGenRootTypes } from "/generated/nexus"

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
        course_variants: !!course_variants ? { create: course_variants } : null,
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

const createMutation = async <T extends { id?: string | null }>({
  prisma,
  slug,
  data,
  field,
}: ICreateMutation<T>) => {
  let existing: T[] | undefined

  try {
    // @ts-ignore: can't be arsed to do the typing, works
    existing = await prisma.course({ slug })[field]()
  } catch (e) {
    throw new Error(`error creating mutation ${field} for course ${slug}: ${e}`)
  }

  const newOnes = (data || []).filter(t => !t.id)
  const updated = (data || [])
    .filter(t => !!t.id)
    .map(t => ({ where: { id: t.id }, data: { ...t, id: undefined } }))
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
        study_modules,
        completion_email,
      } = course

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

      // FIXME: I know there's probably a better way to do this
      const translationMutation: CourseTranslationUpdateManyWithoutCourseInput = await createMutation(
        {
          prisma,
          slug,
          data: course_translations ?? [],
          field: "course_translations",
        },
      )

      const registrationLinkMutation: OpenUniversityRegistrationLinkUpdateManyWithoutCourseInput = await createMutation(
        {
          prisma,
          slug,
          data: open_university_registration_links ?? [],
          field: "open_university_registration_links",
        },
      )

      const courseVariantMutation: CourseVariantUpdateManyWithoutCourseInput = await createMutation(
        {
          prisma,
          slug,
          data: course_variants ?? [],
          field: "course_variants",
        },
      )

      // this had different logic so it's not done with the same helper
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

      const updatedCourse = await prisma.updateCourse({
        where: {
          id,
          slug,
        },
        data: {
          ...omit(course, ["base64", "new_slug", "new_photo"]),
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
          course_variants: Object.keys(courseVariantMutation).length
            ? courseVariantMutation
            : null,
          completion_email: completion_email
            ? { connect: { id: completion_email } }
            : null,
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

const addCourseMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addCourse(t)
  updateCourse(t)
  deleteCourse(t)
}

export default addCourseMutations
