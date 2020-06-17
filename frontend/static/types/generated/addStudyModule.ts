/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StudyModuleCreateArg } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: addStudyModule
// ====================================================

export interface addStudyModule_addStudyModule_study_module_translation {
  __typename: "study_module_translation"
  id: string
  language: string
  name: string
  description: string
}

export interface addStudyModule_addStudyModule {
  __typename: "study_module"
  id: string
  slug: string
  name: string
  image: string | null
  order: number | null
  study_module_translation: addStudyModule_addStudyModule_study_module_translation[]
}

export interface addStudyModule {
  addStudyModule: addStudyModule_addStudyModule | null
}

export interface addStudyModuleVariables {
  study_module: StudyModuleCreateArg
}
