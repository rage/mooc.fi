import { gql } from "@apollo/client"

import {
  StudyModuleCoreFieldsFragment,
  StudyModuleDetailedFieldsFragment,
} from "/graphql/fragments/studyModule"

export const AddStudyModuleMutation = gql`
  mutation AddStudyModule($study_module: StudyModuleCreateArg!) {
    addStudyModule(study_module: $study_module) {
      ...StudyModuleDetailedFields
    }
  }
  ${StudyModuleDetailedFieldsFragment}
`

export const UpdateStudyModuleMutation = gql`
  mutation UpdateStudyModule($study_module: StudyModuleUpsertArg!) {
    updateStudyModule(study_module: $study_module) {
      ...StudyModuleDetailedFields
    }
  }
  ${StudyModuleDetailedFieldsFragment}
`

export const DeleteStudyModuleMutation = gql`
  mutation DeleteStudyModule($id: ID!) {
    deleteStudyModule(id: $id) {
      ...StudyModuleCoreFields
    }
  }
  ${StudyModuleCoreFieldsFragment}
`
