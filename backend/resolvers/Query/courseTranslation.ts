import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import checkAccess from "../../accessControl"

const courseTranslations = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("CourseTranslations", {
    type: "CourseTranslation",
    resolve: (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      return ctx.prisma.courseTranslations()
    },
  })
}

const addCourseTranslationsQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  courseTranslations(t)
}

export default addCourseTranslationsQueries
