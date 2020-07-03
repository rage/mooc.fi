import { gql } from "apollo-boost"

export const AddStudyModuleMutation = gql`
  mutation addStudyModule($study_module: StudyModuleCreateArg!) {
    addStudyModule(study_module: $study_module) {
      id
      slug
      name
      image
      order
      study_module_translations {
        id
        language
        name
        description
      }
    }
  }
`

export const UpdateStudyModuleMutation = gql`
  mutation updateStudyModule($study_module: StudyModuleUpsertArg!) {
    updateStudyModule(study_module: $study_module) {
      id
      slug
      name
      image
      order
      study_module_translations {
        id
        language
        name
        description
      }
    }
  }
`

export const DeleteStudyModuleMutation = gql`
  mutation deleteStudyModule($id: ID!) {
    deleteStudyModule(id: $id) {
      id
      slug
    }
  }
`
