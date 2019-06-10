import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const studyModule = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("study_module", {
    type: "StudyModule",
    args: {
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const { id } = args
      const prisma: Prisma = ctx.prisma
      return prisma.studyModule({
        id: id,
      })
    },
  })
}

const studyModules = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("study_modules", {
    type: "StudyModule",
    resolve: (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      return ctx.prisma.studyModules()
    },
  })
}

const addStudyModuleQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  studyModule(t)
  studyModules(t)
}

export default addStudyModuleQueries
