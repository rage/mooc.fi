import { Prisma, Course } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

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
      const newCourse: Course = await prisma.createCourse({
        name: name,
        slug: slug,
        promote: promote,
        start_point: start_point,
        photo: photo,
        course_translations: null,
        study_module: null,
        status: status,
        study_module: { connect: { id: study_module } },
      })
      return newCourse
    },
  })
}

const addCourseMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addCourse(t)
}

export default addCourseMutations
