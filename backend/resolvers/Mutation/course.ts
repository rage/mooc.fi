import { Prisma, Course } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"

const addCourse = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourse", {
    type: "Course",
    args: {
      name: stringArg(),
      slug: stringArg(),
      photo: stringArg(),
      start_point: booleanArg(),
      promote: booleanArg(),
      status: arg({ type: "CourseStatus" }),
      study_module: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const {
        name,
        slug,
        photo,
        start_point,
        promote,
        status,
        study_module,
      } = args
      const prisma: Prisma = ctx.prisma
      const course: Course = await prisma.createCourse({
        name: name,
        slug: slug,
        promote: promote,
        start_point: start_point,
        photo: photo,
        course_translations: null,
        status: status,
        study_module:
          study_module != null ? { connect: { id: study_module } } : null,
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

const updateCourse = (t: PrismaObjectDefinitionBlock<"Mutaton">) => {
  t.field("updateCourse", {
    type: "Course",
    args: {
      id: idArg({ required: false }),
      name: stringArg(),
      slug: stringArg(),
      new_slug: stringArg(),
      photo: stringArg(),
      start_point: booleanArg(),
      promote: booleanArg(),
      status: arg({ type: "CourseStatus" }),
      study_module: idArg(),
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
      } = args
      return prisma.updateCourse({
        where: {
          id: id,
          slug: slug,
        },
        data: {
          name: name,
          slug: new_slug,
          photo: photo,
          start_point: start_point,
          promote: promote,
          status: status,
          study_module: study_module,
        },
      })
    },
  })
}

const addCourseMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addCourse(t)
  updateCourse(t)
}

export default addCourseMutations
