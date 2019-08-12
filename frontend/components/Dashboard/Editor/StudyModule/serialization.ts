import {
  StudyModuleFormValues,
  StudyModuleTranslationFormValues,
} from "./types"
import { initialValues } from "./form-validation"
import { addStudyModule_addStudyModule_study_module_translations } from "/static/types/generated/addStudyModule"
import { StudyModuleDetails_study_module } from "/static/types/StudyModuleDetails"
import { updateStudyModule_updateStudyModule_study_module_translations } from "/static/types/generated/updateStudyModule"
import { omit } from "lodash"

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
      }
    : initialValues

export const fromStudyModuleForm = ({
  values,
}: {
  values: StudyModuleFormValues
}) => {
  const study_module_translations = (values.study_module_translations || [])
    .length
    ? ((values.study_module_translations || []).map(
        (c: StudyModuleTranslationFormValues) => ({
          ...omit(c, "__typename"),
          id: !c.id || c.id === "" ? null : c.id,
        }),
      ) as (
        | Omit<
            addStudyModule_addStudyModule_study_module_translations,
            "__typename"
          >
        | Omit<
            updateStudyModule_updateStudyModule_study_module_translations,
            "__typename"
          >)[])
    : null

  return {
    ...values,
    id: undefined,
    slug: values.id ? values.slug : values.new_slug,
    study_module_translations,
  }
}
