/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StudyModuleUpsertArg } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: updateStudyModule
// ====================================================

export interface updateStudyModule_updateStudyModule_study_module_translation {
  __typename: "study_module_translation"
  id: string
  language: string
  name: string
  description: string
}

export interface updateStudyModule_updateStudyModule {
  __typename: "study_module"
  id: string
  slug: string
  name: string
  image: string | null
  order: number | null
  study_module_translation: updateStudyModule_updateStudyModule_study_module_translation[]
}

export interface updateStudyModule {
  updateStudyModule: updateStudyModule_updateStudyModule | null
}

export interface updateStudyModuleVariables {
  study_module: StudyModuleUpsertArg
}
