import { gql } from "@apollo/client"

export const UserOrganizationFragment = gql`
  fragment UserOrganizationFragment on UserOrganization {
    id
    confirmed
    consented
    organization {
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

export const UserOrganizationJoinConfirmationFragment = gql`
  fragment UserOrganizationJoinConfirmationFragment on UserOrganizationJoinConfirmation {
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
`
