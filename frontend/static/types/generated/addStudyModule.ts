/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StudyModuleArg } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: addStudyModule
// ====================================================

export interface addStudyModule_addStudyModule_study_module_translations {
  __typename: "StudyModuleTranslation"
  id: any
  language: string
  name: string
  description: string
}

export interface addStudyModule_addStudyModule {
  __typename: "StudyModule"
  id: any
  slug: string
  name: string
  image: string | null
  order: number | null
  study_module_translations:
    | addStudyModule_addStudyModule_study_module_translations[]
    | null
}

export interface addStudyModule {
  addStudyModule: addStudyModule_addStudyModule
}

export interface addStudyModuleVariables {
  study_module: StudyModuleArg
}
