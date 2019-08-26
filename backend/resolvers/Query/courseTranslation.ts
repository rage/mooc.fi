import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import checkAccess from "../../accessControl"
import { stringArg } from "nexus/dist"

const courseTranslations = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("CourseTranslations", {
    type: "CourseTranslation",
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

const addCourseTranslationsQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  courseTranslations(t)
}

export default addCourseTranslationsQueries
