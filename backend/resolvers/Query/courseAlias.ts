import { ForbiddenError } from "apollo-server-core"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import checkAccess from "../../accessControl"

const courseAliass = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("CourseAliases", {
    type: "CourseAlias",
    resolve: (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      return ctx.prisma.courseAliases()
    },
  })
}

const addCourseAliasQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  courseAliass(t)
}

export default addCourseAliasQueries
