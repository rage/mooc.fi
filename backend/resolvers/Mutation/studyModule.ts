import { Prisma, StudyModule } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg } from "nexus/dist"
import checkAccess from "../../accessControl"

const addStudyModule = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addStudyModule", {
    type: "StudyModule",
    args: {},
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const prisma: Prisma = ctx.prisma
      const newStudyModule: StudyModule = await prisma.createStudyModule({})
      return newStudyModule
    },
  })
}

const addStudyModuleMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addStudyModule(t)
}

export default addStudyModuleMutations
