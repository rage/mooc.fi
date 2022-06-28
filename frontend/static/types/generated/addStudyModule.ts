/* tslint:disable */

/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.
import { StudyModuleCreateArg } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: addStudyModule
// ====================================================

export interface addStudyModule_addStudyModule_study_module_translations {
  __typename: "StudyModuleTranslation"
  id: string
  language: string
  name: string
  description: string
}

export interface addStudyModule_addStudyModule {
  __typename: "StudyModule"
  id: string
  slug: string
  name: string
  image: string | null
  order: number | null
  study_module_translations: addStudyModule_addStudyModule_study_module_translations[]
}

export interface addStudyModule {
  addStudyModule: addStudyModule_addStudyModule | null
}

export interface addStudyModuleVariables {
  study_module: StudyModuleCreateArg
}
