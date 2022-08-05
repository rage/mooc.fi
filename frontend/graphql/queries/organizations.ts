import { gql } from "@apollo/client"

import {
  UserOrganizationDataFragment, // UserOrganizationJoinConfirmationDataFragment,
} from "/graphql/fragments/userOrganization"

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

export const CurrentUserOrganizationsQuery = gql`
  query CurrentUserOrganizations {
    currentUser {
      user_organizations {
        ...UserOrganizationData
        # user_organization_join_confirmations {
        #   ...UserOrganizationJoinConfirmationData
        # }
      }
    }
  }
  ${UserOrganizationDataFragment}
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
