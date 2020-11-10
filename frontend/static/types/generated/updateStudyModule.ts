/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StudyModuleUpsertArg } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: updateStudyModule
// ====================================================

export interface updateStudyModule_updateStudyModule_study_module_translations {
  __typename: "StudyModuleTranslation"
  id: string
  language: string
  name: string
  description: string
}

export interface updateStudyModule_updateStudyModule {
  __typename: "StudyModule"
  id: string
  slug: string
  name: string
  image: string | null
  order: number | null
  study_module_translations: updateStudyModule_updateStudyModule_study_module_translations[]
}

export interface updateStudyModule {
  updateStudyModule: updateStudyModule_updateStudyModule | null
}

export interface updateStudyModuleVariables {
  study_module: StudyModuleUpsertArg
}
