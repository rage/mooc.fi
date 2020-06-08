import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const courseAliass = async (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("CourseAliases", {
    type: "course_alias",
    resolve: (_, __, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.courseAliases()
    },
  })
}

const addCourseAliasQueries = (t: ObjectDefinitionBlock<"Query">) => {
  courseAliass(t)
}

export default addCourseAliasQueries
