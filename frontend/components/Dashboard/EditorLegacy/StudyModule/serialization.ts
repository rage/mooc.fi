import { omit } from "remeda"

import { initialValues } from "./form-validation"
import {
  StudyModuleFormValues,
  StudyModuleTranslationFormValues,
} from "./types"

import {
  StudyModuleCreateArg,
  StudyModuleDetailedFieldsFragment,
  StudyModuleUpsertArg,
} from "/graphql/generated"

interface ToStudyModuleFormArgs {
  module?: StudyModuleDetailedFieldsFragment
}

export const toStudyModuleForm = ({
  module,
}: ToStudyModuleFormArgs): StudyModuleFormValues => {
  if (!module) {
    return initialValues
  }
  return {
    ...omit(module, ["__typename", "description", "created_at", "updated_at"]),
    image: module.image ?? "",
    new_slug: module.slug,
    order: module.order ?? undefined,
    study_module_translations:
      module?.study_module_translations?.map((study_module_translation) => ({
        ...omit(study_module_translation, [
          "__typename",
          "created_at",
          "updated_at",
        ]),
        name: study_module_translation.name ?? "",
        language: study_module_translation.language ?? "",
        description: study_module_translation.description ?? "",
      })) ?? [],
  }
}
interface FromStudyModuleFormArgs {
  values: StudyModuleFormValues
}

export const fromStudyModuleForm = ({
  values,
}: FromStudyModuleFormArgs): StudyModuleCreateArg | StudyModuleUpsertArg => {
  const study_module_translations = values?.study_module_translations?.map(
    (study_module_translation: StudyModuleTranslationFormValues) => ({
      ...study_module_translation,
      id:
        !study_module_translation.id || study_module_translation.id === ""
          ? null
          : study_module_translation.id,
    }),
  )

  return {
    ...omit(values, ["id"]),
    slug: values.id ? values.slug : values.new_slug.trim(),
    new_slug: values.new_slug.trim(),
    study_module_translations,
  }
}
