import { schema } from "nexus"
import { idArg, stringArg } from "@nexus/schema"
import { isAdmin } from "../accessControl"

schema.objectType({
  name: "StudyModuleTranslation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.description()
    t.model.language()
    t.model.name()
    t.model.study_module_id()
    t.model.study_module()
  },
})

schema.inputObjectType({
  name: "StudyModuleTranslationCreateInput",
  definition(t) {
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.id("study_module", { required: false })
  },
})

schema.inputObjectType({
  name: "StudyModuleTranslationUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("name", { required: true })
    t.string("language", { required: true })
    t.string("description", { required: true })
    t.id("study_module", { required: false })
  },
})

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.studyModuleTranslations({
      pagination: false,
      authorize: isAdmin,
    })
    /*t.list.field("StudyModuleTranslations", {
      type: "study_module_translation",
      resolve: (_, __, ctx) => {
        // checkAccess(ctx, { allowOrganizations: false })
        return ctx.db.study_module_translation.findMany()
      },
    })*/
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addStudyModuleTranslation", {
      type: "StudyModuleTranslation",
      args: {
        language: stringArg({ required: true }),
        name: stringArg(),
        description: stringArg(),
        study_module: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { language, name, description, study_module } = args

        const newStudyModuleTranslation = await ctx.db.studyModuleTranslation.create(
          {
            data: {
              language: language,
              name: name ?? "",
              description: description ?? "",
              study_module: {
                connect: { id: study_module },
              },
            },
          },
        )
        return newStudyModuleTranslation
      },
    })

    t.field("updateStudyModuletranslation", {
      type: "StudyModuleTranslation",
      args: {
        id: idArg({ required: true }),
        language: stringArg(),
        name: stringArg(),
        description: stringArg(),
        study_module: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { id, language, name, description, study_module } = args

        return ctx.db.studyModuleTranslation.update({
          where: { id },
          data: {
            description: description ?? "",
            language: language ?? "",
            name: name ?? "",
            study_module: {
              connect: { id: study_module },
            },
          },
        })
      },
    })

    t.field("deleteStudyModuleTranslation", {
      type: "StudyModuleTranslation",
      args: {
        id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: (_, { id }, ctx) =>
        ctx.db.studyModuleTranslation.delete({ where: { id } }),
    })
  },
})
