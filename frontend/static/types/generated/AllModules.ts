/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllModules
// ====================================================

export interface AllModules_study_modules {
  __typename: "StudyModule"
  id: string
  slug: string
  name: string
  description: string | null
  image: string | null
  order: number | null
}

export interface AllModules {
  study_modules: (AllModules_study_modules | null)[] | null
}

export interface AllModulesVariables {
  language?: string | null
}
