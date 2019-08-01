import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const studyModule = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("study_module", {
    type: "StudyModule",
    args: {
      id: idArg(),
      slug: stringArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const { id, slug } = args
      const prisma: Prisma = ctx.prisma
      return prisma.studyModule({
        id,
        slug,
      })
    },
  })
}

const studyModules = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("study_modules", {
    type: "StudyModule",
    resolve: (_, args, ctx) => {
      return ctx.prisma.studyModules()
    },
  })
}

const studyModuleExists = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("study_module_exists", {
    type: "Boolean",
    args: {
      slug: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { slug } = args

      return await ctx.prisma.$exists.studyModule({ slug })
    },
  })
}

const addStudyModuleQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  studyModule(t)
  studyModules(t)
  studyModuleExists(t)
}

export default addStudyModuleQueries
