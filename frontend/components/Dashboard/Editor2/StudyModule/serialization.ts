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

export const toStudyModuleForm = ({
  module,
}: {
  module?: StudyModuleDetailedFieldsFragment
}): StudyModuleFormValues =>
  module
    ? {
        ...module,
        image: module.image || "",
        new_slug: module.slug,
        order: module.order ?? undefined,
        study_module_translations:
          module?.study_module_translations?.map((t) => ({
            ...omit(t, "id"),
            _id: t.id ?? undefined,
          })) ?? [],
      }
    : initialValues

export const fromStudyModuleForm = ({
  values,
}: {
  values: StudyModuleFormValues
}): StudyModuleCreateArg | StudyModuleUpsertArg => {
  const study_module_translations = values?.study_module_translations?.map(
    (c: StudyModuleTranslationFormValues) => ({
      ...omit(c, ["__typename", "_id"]),
      id: !c._id || c._id === "" ? null : c._id,
      name: c.name ?? undefined,
      language: c.language ?? undefined,
      description: c.description ?? undefined,
    }),
  )

  return {
    ...omit(values, ["__typename", "id", "courses"]),
    slug: values.id ? values.slug : values.new_slug.trim(),
    new_slug: values.new_slug.trim(),
    study_module_translations,
  }
}
