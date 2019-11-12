import {
  Prisma,
  StudyModule,
  StudyModuleTranslationCreateWithoutStudy_moduleInput,
  StudyModuleTranslationUpdateManyWithWhereNestedInput,
  StudyModuleTranslationScalarWhereInput,
  StudyModuleTranslationUpdateManyWithoutStudy_moduleInput,
  StudyModuleCreateInput,
  StudyModuleUpdateInput,
} from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, arg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const addStudyModule = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addStudyModule", {
    type: "StudyModule",
    args: {
      study_module: arg({
        type: "StudyModuleArg",
        required: true,
      }),
    },
    resolve: async (_, { study_module }, ctx) => {
      checkAccess(ctx, { allowOrganizations: false })

      const { study_module_translations } = study_module
      const prisma: Prisma = ctx.prisma

      const newStudyModule: StudyModule = await prisma.createStudyModule({
        ...study_module,
        new_slug: undefined,
        study_module_translations: !!study_module_translations
          ? { create: study_module_translations }
          : null,
      } as StudyModuleCreateInput)

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
      study_module: arg({
        type: "StudyModuleArg",
        required: true,
      }),
    },
    resolve: async (_, { study_module }, ctx) => {
      checkAccess(ctx)

      const prisma: Prisma = ctx.prisma

      const { id, slug, new_slug, study_module_translations } = study_module

      const existingTranslations = await prisma
        .studyModule({ slug })
        .study_module_translations()
      const newTranslations: StudyModuleTranslationCreateWithoutStudy_moduleInput[] = (
        study_module_translations || []
      ).filter(t => !t.id)
      const updatedTranslations: StudyModuleTranslationUpdateManyWithWhereNestedInput[] = (
        study_module_translations || []
      )
        .filter(t => !!t.id)
        .map(t => ({ where: { id: t.id }, data: { ...t, id: undefined } }))
      const existingTranslationIds = (existingTranslations || []).map(t => t.id)
      const moduleTranslationIds = (study_module_translations || []).map(
        t => t.id,
      )
      const removedTranslationIds: StudyModuleTranslationScalarWhereInput[] = existingTranslationIds
        .filter(id => !moduleTranslationIds.includes(id))
        .map(id => ({ id }))
      /*       const removedTranslationIds: StudyModuleTranslationScalarWhereInput[] = pullAll(
        (existingTranslations || []).map(t => t.id),
        (study_module_translations || []).map(t => t.id).filter(v => !!v),
      ).map(_id => ({ id: _id })) */

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
          slug,
        },
        data: {
          ...study_module,
          new_slug: undefined,
          slug: new_slug ? new_slug : slug,
          study_module_translations: Object.keys(translationMutation).length
            ? translationMutation
            : null,
        } as StudyModuleUpdateInput,
      })
    },
  })
}

const deleteStudyModule = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteStudyModule", {
    type: "StudyModule",
    args: {
      id: idArg({ required: false }),
      slug: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const prisma: Prisma = ctx.prisma
      const { id, slug } = args

      return prisma.deleteStudyModule({
        id,
        slug,
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
