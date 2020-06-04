import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const studyModuleTranslations = async (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("StudyModuleTranslations", {
    type: "StudyModuleTranslation",
    resolve: (_, __, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      return ctx.prisma.studyModuleTranslations()
    },
  })
}

const addStudyModuleTranslationsQueries = (
  t: ObjectDefinitionBlock<"Query">,
) => {
  studyModuleTranslations(t)
}

export default addStudyModuleTranslationsQueries
