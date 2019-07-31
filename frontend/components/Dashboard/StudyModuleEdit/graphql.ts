import { gql } from "apollo-boost"

export const AddStudyModuleMutation = gql`
  mutation addStudyModule(
    $study_module_translations: [StudyModuleTranslationCreateWithoutStudy_moduleInput!]
  ) {
    addStudyModule(study_module_translations: $study_module_translations) {
      id
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
  mutation updateStudyModule(
    $id: ID!
    $study_module_translations: [StudyModuleTranslationWithIdInput!]
  ) {
    updateStudyModule(
      id: $id
      study_module_translations: $study_module_translations
    ) {
      id
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
    }
  }
`
