import { omit } from "lodash"
import { arg, extendType, idArg, nonNull, nullable, stringArg } from "nexus"

import { Prisma } from "@prisma/client"

import { isAdmin } from "../../accessControl"
import { GraphQLUserInputError } from "../../lib/errors"

export const StudyModuleMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addStudyModule", {
      type: "StudyModule",
      args: {
        study_module: nonNull(
          arg({
            type: "StudyModuleCreateArg",
          }),
        ),
      },
      authorize: isAdmin,
      resolve: async (_, { study_module }, ctx) => {
        const { study_module_translations } = study_module

        return ctx.prisma.studyModule.create({
          data: {
            ...study_module,
            name: study_module.name ?? "",
            study_module_translations: !!study_module_translations
              ? {
                  create: study_module_translations.map((s) => ({
                    ...s,
                    name: s?.name ?? "",
                    id: s?.id ?? undefined,
                  })) as Prisma.StudyModuleTranslationCreateWithoutStudy_moduleInput[],
                }
              : undefined,
          },
        })
      },
    })

    t.field("updateStudyModule", {
      type: "StudyModule",
      args: {
        study_module: nonNull(
          arg({
            type: "StudyModuleUpsertArg",
          }),
        ),
      },
      authorize: isAdmin,
      resolve: async (_, { study_module }, ctx) => {
        const { id, slug, new_slug, study_module_translations } = study_module

        if (!slug) {
          throw new GraphQLUserInputError("must provide slug")
        }

        const existingTranslations = await ctx.prisma.studyModule
          .findUnique({ where: { slug } })
          .study_module_translations()
        const newTranslations = (study_module_translations ?? [])
          .filter((t) => !t?.id)
          .map((t) => ({ ...t, id: undefined }))
        const updatedTranslations = (study_module_translations ?? [])
          .filter((t) => !!t?.id)
          .map((t) => ({ where: { id: t?.id }, data: { ...t, id: undefined } }))
        const existingTranslationIds = (existingTranslations ?? []).map(
          (t) => t.id,
        )
        const moduleTranslationIds = (study_module_translations ?? []).map(
          (t) => t?.id,
        )
        const removedTranslationIds = existingTranslationIds
          .filter((id) => !moduleTranslationIds.includes(id))
          .map((id) => ({ id }))

        const translationMutation = {
          create: newTranslations.length ? newTranslations : undefined,
          updateMany: updatedTranslations.length
            ? updatedTranslations
            : undefined,
          deleteMany: removedTranslationIds.length
            ? removedTranslationIds
            : undefined,
        }

        const updatedModule = await ctx.prisma.studyModule.update({
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
        id: nullable(idArg()),
        slug: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { id, slug } = args

        if (!id && !slug) {
          throw "must have at least id or slug"
        }

        const deletedModule = await ctx.prisma.studyModule.delete({
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
