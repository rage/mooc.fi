import {
  StudyModuleFormValues,
  StudyModuleTranslationFormValues,
} from "./types"
import { initialValues } from "./form-validation"
import { addStudyModule_addStudyModule_study_module_translation } from "/static/types/generated/addStudyModule"
import { StudyModuleDetails_study_module } from "/static/types/generated/StudyModuleDetails"
import { updateStudyModule_updateStudyModule_study_module_translation } from "/static/types/generated/updateStudyModule"
import { omit } from "lodash"
import {
  StudyModuleCreateArg,
  StudyModuleUpsertArg,
} from "/static/types/generated/globalTypes"

export const toStudyModuleForm = ({
  module,
}: {
  module?: StudyModuleDetails_study_module
}): StudyModuleFormValues =>
  module
    ? {
        ...module,
        image: module.image || "",
        new_slug: module.slug,
        order: module.order ?? undefined,
        study_module_translation: module?.study_module_translation ?? [],
      }
    : initialValues

export const fromStudyModuleForm = ({
  values,
}: {
  values: StudyModuleFormValues
}): StudyModuleCreateArg | StudyModuleUpsertArg => {
  const study_module_translation = values?.study_module_translation?.map(
    (c: StudyModuleTranslationFormValues) => ({
      ...omit(c, "__typename"),
      id: !c.id || c.id === "" ? null : c.id,
    }),
  ) /* as (
    | Omit<
        addStudyModule_addStudyModule_study_module_translations,
        "__typename"
      >
    | Omit<
        updateStudyModule_updateStudyModule_study_module_translations,
        "__typename"
      >
  )[]*/

  return {
    ...omit(values, ["__typename", "id", "courses"]),
    slug: values.id ? values.slug : values.new_slug.trim(),
    new_slug: values.new_slug.trim(),
    study_module_translation,
  }
}
