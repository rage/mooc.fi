import {
  Prisma,
  StudyModule,
  StudyModuleTranslationCreateWithoutStudy_moduleInput,
  StudyModuleTranslationUpdateManyWithWhereNestedInput,
  StudyModuleTranslationScalarWhereInput,
  StudyModuleTranslationUpdateManyWithoutStudy_moduleInput,
} from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, booleanArg, arg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import pullAll from "lodash/pullAll"

const addStudyModule = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addStudyModule", {
    type: "StudyModule",
    args: {
      study_module_translations: arg({
        type: "StudyModuleTranslationCreateWithoutStudy_moduleInput",
        list: true,
        required: false,
      }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })
      const { study_module_translations } = args

      const prisma: Prisma = ctx.prisma

      const newStudyModule: StudyModule = await prisma.createStudyModule({
        study_module_translations: !!study_module_translations
          ? { create: study_module_translations }
          : null,
      })

      return newStudyModule
    },
  })
}

const updateStudyModule = async (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  t.field("updateStudyModule", {
    type: "StudyModule",
    args: {
      id: idArg({ required: false }),
      study_module_translations: arg({
        type: "StudyModuleTranslationWithIdInput",
        list: true,
      }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const prisma: Prisma = ctx.prisma

      const { id, study_module_translations } = args

      const existingTranslations = await prisma
        .studyModule({ id })
        .study_module_translations()
      const newTranslations: StudyModuleTranslationCreateWithoutStudy_moduleInput[] = (
        study_module_translations || []
      ).filter(t => !t.id)
      const updatedTranslations: StudyModuleTranslationUpdateManyWithWhereNestedInput[] = (
        study_module_translations || []
      )
        .filter(t => !!t.id)
        .map(t => ({ where: { id: t.id }, data: { ...t, id: undefined } }))
      const removedTranslationIds: StudyModuleTranslationScalarWhereInput[] = pullAll(
        (existingTranslations || []).map(t => t.id),
        (study_module_translations || []).map(t => t.id).filter(v => !!v),
      ).map(_id => ({ id: _id }))

      const translationMutation: StudyModuleTranslationUpdateManyWithoutStudy_moduleInput = {
        create: newTranslations.length ? newTranslations : undefined,
        updateMany: updatedTranslations.length
          ? updatedTranslations
          : undefined,
        deleteMany: removedTranslationIds.length
          ? removedTranslationIds
          : undefined,
      }

      return prisma.updateStudyModule({
        where: {
          id,
        },
        data: {
          study_module_translations: Object.keys(translationMutation).length
            ? translationMutation
            : null,
        },
      })
    },
  })
}

const deleteStudyModule = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteStudyModule", {
    type: "StudyModule",
    args: {
      id: idArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const prisma: Prisma = ctx.prisma
      const { id } = args

      return prisma.deleteStudyModule({
        id,
      })
    },
  })
}

const addStudyModuleMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addStudyModule(t)
  updateStudyModule(t)
  deleteStudyModule(t)
}

export default addStudyModuleMutations
