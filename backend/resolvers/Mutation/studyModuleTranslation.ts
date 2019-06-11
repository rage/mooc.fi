import { Prisma, StudyModuleTranslation } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, stringArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const addStudyModuleTranslation = async (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  t.field("addStudyModuleTranslation", {
    type: "StudyModuleTranslation",
    args: {
      language: stringArg(),
      name: stringArg(),
      description: stringArg(),
      study_module: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const { language, name, description, study_module } = args
      const prisma: Prisma = ctx.prisma
      const newStudyModuleTranslation: StudyModuleTranslation = await prisma.createStudyModuleTranslation(
        {
          language: language,
          name: name,
          description: description,
          study_module: { connect: { id: study_module } },
        },
      )
      return newStudyModuleTranslation
    },
  })
}

const addStudyModuleTranslationMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addStudyModuleTranslation(t)
}

export default addStudyModuleTranslationMutations
