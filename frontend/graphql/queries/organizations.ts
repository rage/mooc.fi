import { gql } from "@apollo/client"

import {
  UserOrganizationFragment,
  UserOrganizationJoinConfirmationFragment,
} from "../fragments/userOrganization"

export const OrganizationsQuery = gql`
  query Organizations {
    organizations {
      id
      slug
      hidden
      required_confirmation
      required_organization_email
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
        ...UserOrganizationFragment
        user_organization_join_confirmations {
          ...UserOrganizationJoinConfirmationFragment
        }
      }
    }
  }
  ${UserOrganizationFragment}
  ${UserOrganizationJoinConfirmationFragment}
`

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
