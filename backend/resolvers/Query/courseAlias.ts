import { ForbiddenError } from "apollo-server-core"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"

const courseAliass = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("CourseAliases", {
    type: "CourseAlias",
    resolve: (_, args, ctx) => {
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
      return ctx.prisma.courseAliases()
    },
  })
}

const addCourseAliasQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  courseAliass(t)
}

export default addCourseAliasQueries
