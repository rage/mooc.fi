import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg, arg } from "nexus/dist"
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
    args: {
      orderBy: arg({ type: "StudyModuleOrderByInput" }),
    },
    resolve: async (_, args, ctx) => {
      // @ts-ignore
      return await ctx.prisma.studyModules({ orderBy: args.orderBy })
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
