import { stringArg, idArg, arg } from "@nexus/schema"
// import checkAccess from "../../../accessControl"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("study_module", {
      type: "study_module",
      args: {
        id: idArg(),
        slug: stringArg(),
        language: stringArg(),
      },
      nullable: true,
      resolve: async (_, args, ctx) => {
        // checkAccess(ctx, { allowOrganizations: false })
        const { id, slug, language } = args

        const study_module = await ctx.db.study_module.findOne({
          where: {
            id,
            slug,
          },
        })

        if (!study_module) {
          throw new Error("study module not found")
        }

        if (language) {
          const module_translations = await ctx.db.study_module_translation.findMany(
            {
              where: {
                study_module: study_module.id,
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
      type: "study_module",
      args: {
        orderBy: arg({ type: "study_moduleOrderByInput" }),
        language: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { orderBy, language } = args

        const modules = await ctx.db.study_module.findMany({
          orderBy,
        })

        const filtered = language
          ? (
              await Promise.all(
                modules.map(async (module: any) => {
                  const module_translations = await ctx.db.study_module_translation.findMany(
                    {
                      where: { study_module: module.id, language },
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
        slug: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        // checkAccess(ctx)

        const { slug } = args

        return !!(await ctx.db.study_module.findOne({ where: { slug } }))
      },
    })
  },
})
