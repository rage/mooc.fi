/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllEditorModulesWithTranslations
// ====================================================

export interface AllEditorModulesWithTranslations_study_modules_study_module_translation {
  __typename: "study_module_translation"
  id: string
  language: string
  name: string
  description: string
}

export interface AllEditorModulesWithTranslations_study_modules {
  __typename: "study_module"
  id: string
  slug: string
  name: string
  image: string | null
  order: number | null
  study_module_translation: AllEditorModulesWithTranslations_study_modules_study_module_translation[]
}

export interface AllEditorModulesWithTranslations {
  study_modules: AllEditorModulesWithTranslations_study_modules[] | null
}
