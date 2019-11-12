import { gql } from "apollo-boost"

export const AddStudyModuleMutation = gql`
  mutation addStudyModule($study_module: StudyModuleArg!) {
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
  mutation updateStudyModule($study_module: StudyModuleArg!) {
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
  mutation deleteStudyModule($slug: String!) {
    deleteStudyModule(slug: $slug) {
      id
      slug
    }
  }
`
