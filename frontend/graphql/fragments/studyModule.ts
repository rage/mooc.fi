import { gql } from "@apollo/client"

import { CourseFieldsFragment } from "/graphql/fragments/course"

export const StudyModuleCoreFieldsFragment = gql`
  fragment StudyModuleCoreFields on StudyModule {
    id
    slug
    name
    created_at
    updated_at
  }
`

export const StudyModuleFieldsFragment = gql`
  fragment StudyModuleFields on StudyModule {
    ...StudyModuleCoreFields
    description
    image
    order
  }
  ${StudyModuleCoreFieldsFragment}
`

export const StudyModuleTranslationFieldsFragment = gql`
  fragment StudyModuleTranslationFields on StudyModuleTranslation {
    id
    study_module_id
    language
    name
    description
    created_at
    updated_at
  }
`

export const StudyModuleDetailedFieldsFragment = gql`
  fragment StudyModuleDetailedFields on StudyModule {
    ...StudyModuleFields
    study_module_translations {
      ...StudyModuleTranslationFields
    }
  }
  ${StudyModuleFieldsFragment}
  ${StudyModuleTranslationFieldsFragment}
`

export const StudyModuleFieldsWithCoursesFragment = gql`
  fragment StudyModuleFieldsWithCourses on StudyModule {
    ...StudyModuleFields
    courses {
      ...CourseFields
    }
  }
  ${StudyModuleFieldsFragment}
  ${CourseFieldsFragment}
`
