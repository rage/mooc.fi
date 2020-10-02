import { arg, extendType, idArg, stringArg } from "@nexus/schema"
import { UserInputError } from "apollo-server-core"
import { isAdmin, or, isUser, Role } from "../../accessControl"
import { filterNull } from "../../util/db-functions"

export const StudyModuleQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("study_module", {
      type: "StudyModule",
      args: {
        id: idArg(),
        slug: stringArg(),
        language: stringArg(),
      },
      authorize: or(isAdmin, isUser),
      nullable: true,
      resolve: async (_, args, ctx) => {
        const { id, slug, language } = args

        if (!id && !slug) {
          throw new UserInputError("must provide id or slug")
        }

        const study_module = await ctx.prisma.studyModule.findOne({
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
          },
          ...(ctx.role !== Role.ADMIN
            ? {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                },
              }
            : {}),
        })

        if (!study_module) {
          throw new Error("study module not found")
        }

        if (language) {
          const module_translations = await ctx.prisma.studyModuleTranslation.findMany(
            {
              where: {
                study_module_id: study_module.id,
                language,
              },
            },
          )

          if (!module_translations.length) {
            return Promise.resolve(null)
          }

          const { name, description = "" } = module_translations[0]
          return {
            ...study_module,
            name,
            description,
          }
        }

        return {
          ...study_module,
          description: "",
        }
      },
    })

    t.crud.studyModules({
      alias: "study_modules",
      ordering: true,
    })

    t.list.field("study_modules", {
      type: "StudyModule",
      args: {
        orderBy: arg({ type: "StudyModuleOrderByInput" }),
        language: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { orderBy, language } = args

        const modules = await ctx.prisma.studyModule.findMany({
          orderBy: filterNull(orderBy) ?? undefined,
        })

        const filtered = language
          ? (
              await Promise.all(
                modules.map(async (module: any) => {
                  const module_translations = await ctx.prisma.studyModuleTranslation.findMany(
                    {
                      where: { study_module_id: module.id, language },
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
          : modules.map((module: any) => ({
              ...module,
              description: "",
            }))

        return filtered
      },
    })

    t.field("study_module_exists", {
      type: "Boolean",
      args: {
        slug: stringArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { slug }, ctx) => {
        return (
          (await ctx.prisma.studyModule.findMany({ where: { slug } })).length >
          0
        )
      },
    })
  },
})
