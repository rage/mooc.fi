import {
  objectType,
  inputObjectType,
  extendType,
  idArg,
  stringArg,
  nonNull,
} from "nexus"
import { isAdmin } from "../accessControl"

export const StudyModuleTranslation = objectType({
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

export const StudyModuleTranslationCreateInput = inputObjectType({
  name: "StudyModuleTranslationCreateInput",
  definition(t) {
    t.nonNull.string("name")
    t.nonNull.string("language")
    t.nonNull.string("description")
    t.nullable.id("study_module")
  },
})

export const StudyModuleTranslationUpsertInput = inputObjectType({
  name: "StudyModuleTranslationUpsertInput",
  definition(t) {
    t.nullable.id("id")
    t.nonNull.string("name")
    t.nonNull.string("language")
    t.nonNull.string("description")
    t.nullable.id("study_module")
  },
})

export const StudyModuleTranslationQueries = extendType({
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
        return ctx.prisma.study_module_translation.findMany()
      },
    })*/
  },
})

export const StudyModuleTranslationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addStudyModuleTranslation", {
      type: "StudyModuleTranslation",
      args: {
        language: nonNull(stringArg()),
        name: stringArg(),
        description: stringArg(),
        study_module: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { language, name, description, study_module } = args

        const newStudyModuleTranslation = await ctx.prisma.studyModuleTranslation.create(
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
        id: nonNull(idArg()),
        language: stringArg(),
        name: stringArg(),
        description: stringArg(),
        study_module: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { id, language, name, description, study_module } = args

        return ctx.prisma.studyModuleTranslation.update({
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
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: (_, { id }, ctx) =>
        ctx.prisma.studyModuleTranslation.delete({ where: { id } }),
    })
  },
})
