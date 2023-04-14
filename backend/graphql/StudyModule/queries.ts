import { omit } from "lodash"
import { arg, booleanArg, extendType, idArg, nonNull, stringArg } from "nexus"

import { StudyModule, StudyModuleTranslation } from "@prisma/client"

import { isAdmin, isUser, or, Role } from "../../accessControl"
import { GraphQLUserInputError } from "../../lib/errors"
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
        translationFallback: booleanArg({ default: false }),
      },
      authorize: or(isAdmin, isUser),
      validate: (_, { id, slug }) => {
        if (!id && !slug) {
          throw new GraphQLUserInputError("must provide id or slug")
        }
      },
      resolve: async (_, args, ctx) => {
        const { id, slug, language, translationFallback } = args

        const study_module:
          | (StudyModule & {
              study_module_translations?: StudyModuleTranslation[]
            })
          | null = await ctx.prisma.studyModule.findUnique({
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
          const module_translation =
            await ctx.prisma.studyModuleTranslation.findFirst({
              where: {
                study_module_id: study_module.id,
                language,
              },
            })

          if (!module_translation) {
            if (!translationFallback) {
              return Promise.resolve(null)
            }
          } else {
            const { name, description = "" } = module_translation
            return {
              ...study_module,
              name,
              description,
            }
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

    t.list.nonNull.field("study_modules", {
      type: "StudyModule",
      args: {
        orderBy: arg({ type: "StudyModuleOrderByWithRelationInput" }),
        language: stringArg(),
      },
      resolve: async (_, { orderBy, language }, ctx) => {
        const modules: (StudyModule & {
          study_module_translations?: StudyModuleTranslation[]
        })[] = await ctx.prisma.studyModule.findMany({
          orderBy: filterNull(orderBy) ?? undefined,
          ...(language
            ? {
                include: {
                  study_module_translations: {
                    where: {
                      language,
                    },
                  },
                },
              }
            : {}),
        })

        const filtered = modules.map((study_module) => ({
          ...omit(study_module, "study_module_translations"),
          name:
            study_module?.study_module_translations?.[0]?.name ??
            study_module?.name,
          description:
            study_module?.study_module_translations?.[0]?.description ?? "",
        }))

        return filtered as (StudyModule & {
          name: string
          description: string
        })[]
      },
    })

    t.field("study_module_exists", {
      type: "Boolean",
      args: {
        slug: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { slug }, ctx) => {
        return Boolean(
          await ctx.prisma.studyModule.findFirst({
            select: { id: true },
            where: { slug },
          }),
        )
      },
    })
  },
})
