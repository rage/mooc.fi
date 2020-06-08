import checkAccess from "../../accessControl"
import { stringArg } from "@nexus/schema"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const courseTranslations = async (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("CourseTranslations", {
    type: "course_translation",
    args: {
      language: stringArg(),
    },
    resolve: (_, args, ctx) => {
      const { language } = args
      checkAccess(ctx, { allowOrganizations: false })
      return ctx.prisma.courseTranslations({ where: { language } })
    },
  })
}

const addCourseTranslationsQueries = (t: ObjectDefinitionBlock<"Query">) => {
  courseTranslations(t)
}

export default addCourseTranslationsQueries
