import checkAccess from "../../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.list.field("CourseAliases", {
      type: "course_alias",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.prisma.courseAliases()
      },
    })
  },
})

const addCourseAliasQueries = (t: ObjectDefinitionBlock<"Query">) => {
  // courseAliass(t)
}

export default addCourseAliasQueries
