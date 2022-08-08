import { gql } from "@apollo/client"

import { UserOrganizationCoreFieldsFragment } from "/graphql/fragments/userOrganization"

export const CurrentUserOrganizationsQuery = gql`
  query CurrentUserOrganizations {
    currentUser {
      user_organizations {
        ...UserOrganizationCoreFields
        # user_organization_join_confirmations {
        #   ...UserOrganizationJoinConfirmationData
        # }
      }
    }
  }
  ${UserOrganizationCoreFieldsFragment}
`

export const UserOrganizationsQuery = gql`
  query UserOrganizations($user_id: ID) {
    userOrganizations(user_id: $user_id) {
      id
      organization {
        id
      }
    }
  }
`
