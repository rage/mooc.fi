import { gql } from "@apollo/client"

import { CourseCoreFieldsFragment } from "/graphql/fragments/course"
import {
  StudyModuleDetailedFieldsFragment,
  StudyModuleFieldsFragment,
  StudyModuleTranslationFieldsFragment,
} from "/graphql/fragments/studyModule"

export const StudyModulesQuery = gql`
  query StudyModules($language: String) {
    study_modules(orderBy: { id: asc }, language: $language) {
      ...StudyModuleFields
    }
  }
  ${StudyModuleFieldsFragment}
`

export const EditorStudyModulesQuery = gql`
  query EditorStudyModules {
    study_modules(orderBy: { id: asc }) {
      ...StudyModuleDetailedFields
    }
  }
  ${StudyModuleDetailedFieldsFragment}
`

export const EditorStudyModuleDetailsQuery = gql`
  query EditorStudyModuleDetails($slug: String!) {
    study_module(slug: $slug) {
      ...StudyModuleFields
      courses {
        ...CourseCoreFields
      }
      study_module_translations {
        ...StudyModuleTranslationFields
      }
    }
  }
  ${StudyModuleFieldsFragment}
  ${CourseCoreFieldsFragment}
  ${StudyModuleTranslationFieldsFragment}
`

export const StudyModuleExistsQuery = gql`
  query StudyModuleExists($slug: String!) {
    study_module_exists(slug: $slug)
  }
`
