/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: StudyModuleDetails
// ====================================================

export interface StudyModuleDetails_study_module_courses {
  __typename: "Course"
  id: string
  name: string
  slug: string
}

export interface StudyModuleDetails_study_module_study_module_translations {
  __typename: "StudyModuleTranslation"
  id: string
  name: string
  language: string
  description: string
}

export interface StudyModuleDetails_study_module {
  __typename: "StudyModule"
  id: string
  slug: string
  name: string
  image: string | null
  order: number | null
  courses: (StudyModuleDetails_study_module_courses | null)[] | null
  study_module_translations: StudyModuleDetails_study_module_study_module_translations[]
}

export interface StudyModuleDetails {
  study_module: StudyModuleDetails_study_module | null
}

export interface StudyModuleDetailsVariables {
  slug: string
}
