import { gql } from "@apollo/client"

import { OrganizationCoreFieldsFragment } from "/graphql/fragments/organization"

export const UserOrganizationCoreFieldsFragment = gql`
  fragment UserOrganizationCoreFields on UserOrganization {
    id
    user_id
    organization_id
    # confirmed
    # consented
    organization {
      ...OrganizationCoreFields
    }
    created_at
    updated_at
  }
  ${OrganizationCoreFieldsFragment}
`

/*export const UserOrganizationJoinConfirmationDataFragment = gql`
  fragment UserOrganizationJoinConfirmationData on UserOrganizationJoinConfirmation {
    id
    email
    confirmed
    confirmed_at
    created_at
    updated_at
    expired
    expires_at
    redirect
    language
    email_delivery {
      id
      email
      sent
      error
      updated_at
    }
  }
`*/
