import {
  Prisma,
  Course,
  CourseTranslationUpdateManyWithoutCourseInput,
  CourseTranslationCreateWithoutCourseInput,
  CourseTranslationUpdateManyWithWhereNestedInput,
  CourseTranslationScalarWhereInput,
} from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import * as pullAll from "lodash/pullAll"

const addCourse = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourse", {
    type: "Course",
    args: {
      name: stringArg(),
      slug: stringArg(),
      // photo: stringArg(),
      photo: idArg(),
      start_point: booleanArg(),
      promote: booleanArg(),
      status: arg({ type: "CourseStatus" }),
      study_module: idArg(),
      // this works like it should, but disabled it because update doesn't
      course_translations: arg({
        type: "CourseTranslationCreateInput",
        list: true,
        required: false,
      }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const {
        name,
        slug,
        start_point,
        photo,
        promote,
        status,
        study_module,
        course_translations,
      } = args

      const prisma: Prisma = ctx.prisma
      const course: Course = await prisma.createCourse({
        name: name,
        slug: slug,
        promote: promote,
        start_point: start_point,
        photo: !!photo ? { connect: { id: photo } } : null,
        course_translations: !!course_translations
          ? { create: course_translations }
          : null,
        status: status,
        study_module: !!study_module ? { connect: { id: study_module } } : null,
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

const updateCourse = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("updateCourse", {
    type: "Course",
    args: {
      id: idArg({ required: false }),
      name: stringArg(),
      slug: stringArg(),
      new_slug: stringArg(),
      photo: idArg(),
      start_point: booleanArg(),
      promote: booleanArg(),
      status: arg({ type: "CourseStatus" }),
      study_module: idArg(),
      course_translations: arg({
        type: "CourseTranslationWithIdInput",
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
        photo,
        start_point,
        promote,
        status,
        study_module,
        course_translations,
      } = args

      const existingTranslations = await prisma
        .course({ slug })
        .course_translations()
      const newTranslations: CourseTranslationCreateWithoutCourseInput[] = course_translations.filter(
        t => !t.id,
      )
      const updatedTranslations: CourseTranslationUpdateManyWithWhereNestedInput[] = course_translations
        .filter(t => !!t.id)
        .map(t => ({ where: { id: t.id }, data: { ...t, id: undefined } }))
      const removedTranslationIds: CourseTranslationScalarWhereInput[] = pullAll(
        existingTranslations.map(t => t.id),
        course_translations.map(t => t.id).filter(v => !!v),
      ).map(_id => ({ id: _id }))

      const translationMutation: CourseTranslationUpdateManyWithoutCourseInput = {
        create: newTranslations.length ? newTranslations : undefined,
        updateMany: updatedTranslations.length
          ? updatedTranslations
          : undefined,
        deleteMany: removedTranslationIds.length
          ? removedTranslationIds
          : undefined,
      }

      return prisma.updateCourse({
        where: {
          id: id,
          slug: slug,
        },
        data: {
          name: name,
          slug: new_slug ? new_slug : slug,
          photo: !!photo ? { connect: { id: photo } } : null,
          start_point: start_point,
          promote: promote,
          status: status,
          course_translations: Object.keys(translationMutation).length
            ? translationMutation
            : null,
          study_module: !!study_module
            ? { connect: { id: study_module } }
            : null,
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

      // TODO: delete photo?
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
