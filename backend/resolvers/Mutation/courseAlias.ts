import { ForbiddenError } from "apollo-server-core"
import { Prisma, CourseAlias } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, stringArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const addCourseAlias = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourseAlias", {
    type: "CourseAlias",
    args: {
      course_code: stringArg(),
      course: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const { course_code, course } = args
      const prisma: Prisma = ctx.prisma
      const newCourseAlias: CourseAlias = await prisma.createCourseAlias({
        course_code: course_code,
        course: { connect: { id: course } },
      })
      return newCourseAlias
    },
  })
}

const addCourseAliasMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addCourseAlias(t)
}

export default addCourseAliasMutations
