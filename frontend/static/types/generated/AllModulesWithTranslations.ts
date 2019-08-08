/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllModulesWithTranslations
// ====================================================

export interface AllModulesWithTranslations_study_modules_study_module_translations {
  __typename: "StudyModuleTranslation"
  id: any
  language: string
  name: string
  description: string
}

export interface AllModulesWithTranslations_study_modules {
  __typename: "StudyModule"
  id: any
  slug: string
  name: string
  image: string | null
  order: number | null
  study_module_translations:
    | AllModulesWithTranslations_study_modules_study_module_translations[]
    | null
}

export interface AllModulesWithTranslations {
  study_modules: AllModulesWithTranslations_study_modules[]
}
