import { Prisma, CourseAlias } from "../../generated/prisma-client"
import { idArg, stringArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addCourseAlias = async (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourseAlias", {
    type: "CourseAlias",
    args: {
      course_code: stringArg(),
      course: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { course_code, course } = args
      const prisma: Prisma = ctx.prisma

      // FIXME: what to do on empty course_code?
      if (!course_code) {
        throw "has to have a course code"
      }

      const newCourseAlias: CourseAlias = await prisma.createCourseAlias({
        course_code: course_code ?? "",
        course: { connect: { id: course } },
      })
      return newCourseAlias
    },
  })
}

const addCourseAliasMutations = (t: ObjectDefinitionBlock<"Mutation">) => {
  addCourseAlias(t)
}

export default addCourseAliasMutations
