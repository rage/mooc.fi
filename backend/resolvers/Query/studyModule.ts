import {
  Prisma,
  StudyModule,
  StudyModuleOrderByInput,
} from "../../generated/prisma-client"
import { stringArg, idArg, arg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const studyModule = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("study_module", {
    type: "StudyModule",
    args: {
      id: idArg(),
      slug: stringArg(),
      language: stringArg(),
    },
    nullable: true,
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const { id, slug, language } = args
      const prisma: Prisma = ctx.prisma

      const study_module = await prisma.studyModule({
        id,
        slug,
      })

      if (language) {
        const module_translations = await prisma.studyModuleTranslations({
          where: { study_module, language },
        })

        if (!module_translations.length) {
          return Promise.resolve(null)
        }

        const { name, description = "" } = module_translations[0]
        return {
          ...study_module,
          name,
          description,
        } as NexusGenRootTypes["StudyModule"]
      }

      return {
        ...study_module,
        description: "",
      } as NexusGenRootTypes["StudyModule"]
    },
  })
}

const studyModules = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("study_modules", {
    type: "StudyModule",
    args: {
      orderBy: arg({ type: "StudyModuleOrderByInput" }),
      language: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      const { orderBy, language } = args
      const { prisma } = ctx

      const modules = await prisma.studyModules({
        orderBy: orderBy as StudyModuleOrderByInput,
      })

      const filtered = language
        ? (
            await Promise.all(
              modules.map(async (module: StudyModule) => {
                const module_translations = await prisma.studyModuleTranslations(
                  {
                    where: { study_module: module, language },
                  },
                )

                if (!module_translations.length) {
                  return Promise.resolve(null)
                }

                const { name, description = "" } = module_translations[0]

                return { ...module, name, description }
              }),
            )
          ).filter((v) => !!v)
        : modules.map((module: StudyModule) => ({ ...module, description: "" }))

      return filtered as Array<NexusGenRootTypes["StudyModule"]>
    },
  })
}

const studyModuleExists = (t: ObjectDefinitionBlock<"Query">) => {
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

const addStudyModuleQueries = (t: ObjectDefinitionBlock<"Query">) => {
  studyModule(t)
  studyModules(t)
  studyModuleExists(t)
}

export default addStudyModuleQueries
