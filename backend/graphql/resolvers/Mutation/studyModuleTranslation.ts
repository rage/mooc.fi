import { idArg, stringArg } from "@nexus/schema"
import { schema } from "nexus"
import { UserInputError } from "apollo-server-core"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addStudyModuleTranslation", {
      type: "study_module_translation",
      args: {
        language: stringArg({ required: true }),
        name: stringArg(),
        description: stringArg(),
        study_module: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { language, name, description, study_module } = args

        if (!study_module) {
          throw new UserInputError("must provide study_module")
        }

        const newStudyModuleTranslation = await ctx.db.study_module_translation.create(
          {
            data: {
              language: language,
              name: name ?? "",
              description: description ?? "",
              study_module_study_moduleTostudy_module_translation: {
                connect: { id: study_module },
              },
            },
          },
        )
        return newStudyModuleTranslation
      },
    })

    t.field("updateStudyModuletranslation", {
      type: "study_module_translation",
      args: {
        id: idArg({ required: true }),
        language: stringArg(),
        name: stringArg(),
        description: stringArg(),
        study_module: idArg(),
      },
      resolve: (_, args, ctx) => {
        const { id, language, name, description, study_module } = args

        if (!id || !study_module) {
          throw new UserInputError("must provide id and study_module")
        }

        return ctx.db.study_module_translation.update({
          where: { id },
          data: {
            description: description ?? "",
            language: language ?? "",
            name: name ?? "",
            study_module_study_moduleTostudy_module_translation: {
              connect: { id: study_module },
            },
          },
        })
      },
    })
  },
})
