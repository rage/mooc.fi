import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import checkAccess from "../../accessControl"

const studyModuleTranslations = async (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  t.list.field("StudyModuleTranslations", {
    type: "StudyModuleTranslation",
    resolve: (_, __, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      return ctx.prisma.studyModuleTranslations()
    },
  })
}

const addStudyModuleTranslationsQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  studyModuleTranslations(t)
}

export default addStudyModuleTranslationsQueries
