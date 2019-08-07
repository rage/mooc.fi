/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllStudyModules
// ====================================================

export interface AllStudyModules_study_modules_study_module_translations {
  __typename: "StudyModuleTranslation"
  id: any
  language: string
  name: string
  description: string
}

export interface AllStudyModules_study_modules {
  __typename: "StudyModule"
  id: any
  slug: string
  study_module_translations:
    | AllStudyModules_study_modules_study_module_translations[]
    | null
}

export interface AllStudyModules {
  study_modules: AllStudyModules_study_modules[]
}
