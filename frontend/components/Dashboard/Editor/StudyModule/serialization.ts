import { omit } from "lodash"

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

interface ToStudyModuleFormProps {
  module?: StudyModuleDetailedFieldsFragment
}

export const toStudyModuleForm = ({
  module,
}: ToStudyModuleFormProps): StudyModuleFormValues =>
  module
    ? {
        ...module,
        image: module.image || "",
        new_slug: module.slug,
        order: module.order ?? undefined,
        study_module_translations: module?.study_module_translations ?? [],
      }
    : initialValues

export const fromStudyModuleForm = ({
  values,
}: {
  values: StudyModuleFormValues
}): StudyModuleCreateArg | StudyModuleUpsertArg => {
  const study_module_translations = values?.study_module_translations?.map(
    (c: StudyModuleTranslationFormValues) => ({
      ...omit(c, "__typename"),
      id: !c.id || c.id === "" ? null : c.id,
    }),
  )

  return {
    ...omit(values, ["__typename", "id", "courses"]),
    slug: values.id ? values.slug : values.new_slug.trim(),
    new_slug: values.new_slug.trim(),
    study_module_translations,
  }
}
