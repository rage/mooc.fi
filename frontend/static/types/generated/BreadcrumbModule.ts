/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BreadcrumbModule
// ====================================================

export interface BreadcrumbModule_study_module_study_module_translation {
  __typename: "study_module_translation"
  id: string
  language: string
  name: string
}

export interface BreadcrumbModule_study_module {
  __typename: "study_module"
  id: string
  slug: string
  name: string
  study_module_translation: BreadcrumbModule_study_module_study_module_translation[]
}

export interface BreadcrumbModule {
  study_module: BreadcrumbModule_study_module | null
}

export interface BreadcrumbModuleVariables {
  slug?: string | null
}
