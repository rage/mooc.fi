import { gql } from "apollo-boost"

export const AllModulesQuery = gql`
  query AllModules($language: String) {
    study_modules(orderBy: { id: asc }, language: $language) {
      id
      slug
      name
      description
      image
      order
    }
  }
`

export const AllEditorModulesQuery = gql`
  query AllEditorModulesWithTranslations {
    study_modules(orderBy: { id: asc }) {
      id
      slug
      name
      image
      order
      study_module_translation {
        id
        language
        name
        description
      }
    }
  }
`

export const CheckModuleSlugQuery = gql`
  query checkModuleSlug($slug: String) {
    study_module_exists(slug: $slug)
  }
`
