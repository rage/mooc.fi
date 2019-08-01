/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StudyModuleTranslationCreateWithoutStudy_moduleInput } from "./globalTypes"

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
  study_module_translations:
    | addStudyModule_addStudyModule_study_module_translations[]
    | null
}

export interface addStudyModule {
  addStudyModule: addStudyModule_addStudyModule
}

export interface addStudyModuleVariables {
  slug: string
  name: string
  study_module_translations?:
    | StudyModuleTranslationCreateWithoutStudy_moduleInput[]
    | null
}
