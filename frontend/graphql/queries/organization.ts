import { gql } from "@apollo/client"

export const OrganizationsQuery = gql`
  query Organizations {
    organizations {
      id
      slug
      hidden
      # required_confirmation
      # required_organization_email
      organization_translations {
        language
        name
        information
      }
    }
  }
`
// ${UserOrganizationJoinConfirmationDataFragment}

export const OrganizationByIdQuery = gql`
  query OrganizationById($id: ID!) {
    organization(id: $id) {
      hidden
      organization_translations {
        name
      }
    }
  }
`
