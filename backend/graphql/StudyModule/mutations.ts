import { extendType, arg, idArg, stringArg } from "@nexus/schema"
import { UserInputError } from "apollo-server-core"
import { omit } from "lodash"
import { isAdmin } from "../../accessControl"

export const StudyModuleMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addStudyModule", {
      type: "StudyModule",
      args: {
        study_module: arg({
          type: "StudyModuleCreateArg",
          required: true,
        }),
      },
      authorize: isAdmin,
      resolve: async (_, { study_module }, ctx) => {
        const { study_module_translations } = study_module

        return ctx.db.studyModule.create({
          data: {
            ...study_module,
            name: study_module.name ?? "",
            study_module_translations: !!study_module_translations
              ? {
                  create: study_module_translations.map((s) => ({
                    ...s,
                    name: s.name ?? "",
                    id: s.id ?? undefined,
                  })),
                }
              : undefined,
          },
        })
      },
    })

    t.field("updateStudyModule", {
      type: "StudyModule",
      args: {
        study_module: arg({
          type: "StudyModuleUpsertArg",
          required: true,
        }),
      },
      authorize: isAdmin,
      resolve: async (_, { study_module }, ctx) => {
        const { id, slug, new_slug, study_module_translations } = study_module

        if (!slug) {
          throw new UserInputError("must provide slug")
        }

        const existingTranslations = await ctx.db.studyModule
          .findOne({ where: { slug } })
          .study_module_translations()
        const newTranslations = (study_module_translations || [])
          .filter((t) => !t.id)
          .map((t) => ({ ...t, id: undefined }))
        const updatedTranslations = (study_module_translations || [])
          .filter((t) => !!t.id)
          .map((t) => ({ where: { id: t.id }, data: { ...t, id: undefined } }))
        const existingTranslationIds = (existingTranslations || []).map(
          (t) => t.id,
        )
        const moduleTranslationIds = (study_module_translations || []).map(
          (t) => t.id,
        )
        const removedTranslationIds = existingTranslationIds
          .filter((id) => !moduleTranslationIds.includes(id))
          .map((id) => ({ id }))
        /*       const removedTranslationIds: StudyModuleTranslationScalarWhereInput[] = pullAll(
          (existingTranslations || []).map(t => t.id),
          (study_module_translations || []).map(t => t.id).filter(v => !!v),
        ).map(_id => ({ id: _id })) */

        const translationMutation = {
          create: newTranslations.length ? newTranslations : undefined,
          updateMany: updatedTranslations.length
            ? updatedTranslations
            : undefined,
          deleteMany: removedTranslationIds.length
            ? removedTranslationIds
            : undefined,
        }

        const updatedModule = await ctx.db.studyModule.update({
          where: {
            id: id ?? undefined,
            slug,
          },
          data: {
            ...omit(study_module, ["new_slug"]),
            slug: new_slug ? new_slug : slug,
            // FIXME/TODO: implement something like notEmpty for id field to fix typing
            // @ts-ignore: TS doesn't get that in where: { id } the id has been already filtered
            study_module_translations: Object.keys(translationMutation).length
              ? translationMutation
              : undefined,
          },
        })

        return updatedModule
      },
    })

    t.field("deleteStudyModule", {
      type: "StudyModule",
      args: {
        id: idArg({ required: false }),
        slug: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { id, slug } = args

        if (!id && !slug) {
          throw "must have at least id or slug"
        }

        const deletedModule = await ctx.db.studyModule.delete({
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
          },
        })

        return deletedModule
      },
    })
  },
})
