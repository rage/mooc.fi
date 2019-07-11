import { Prisma, Course } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import KafkaProducer, { ProducerMessage } from "../../services/kafkaProducer"
import { uploadBase64Image } from "../../services/google-cloud"

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
      const { name, slug, start_point, promote, status, study_module } = args

      let photo = args.photo

      if (photo) {
        try {
          const uploadedPhoto = await uploadBase64Image(photo)
          photo = uploadedPhoto
        } catch (e) {
          console.log(e)
        }
      }

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

const updateCourse = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("updateCourse", {
    type: "Course",
    args: {
      id: idArg({ required: false }),
      name: stringArg(),
      slug: stringArg(),
      photo: stringArg(),
      /*       photos: arg({ type: "ImageArg" }), */
      start_point: booleanArg(),
      promote: booleanArg(),
      status: arg({ type: "CourseStatus" }),
      study_module: idArg(),
      //new_photo: stringArg({ required: false }),
      new_slug: stringArg({ required: false }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const prisma: Prisma = ctx.prisma
      const {
        id,
        name,
        slug,
        start_point,
        promote,
        status,
        study_module,
        new_slug,
        new_photo,
      } = args

      // TODO: delete old photo?

      let photo = args.photo

      if (new_photo) {
        try {
          const uploadedPhoto = await uploadBase64Image(new_photo)
          photo = uploadedPhoto
        } catch (e) {
          console.log(e)
        }
      }

      return prisma.updateCourse({
        where: {
          id: id,
          slug: slug,
        },
        data: {
          name: name,
          slug: new_slug ? new_slug : slug,
          photo: photo,
          start_point: start_point,
          promote: promote,
          status: status,
          study_module:
            study_module != null ? { connect: { id: study_module } } : null,
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
