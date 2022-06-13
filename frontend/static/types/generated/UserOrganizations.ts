/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserOrganizations
// ====================================================

export interface UserOrganizations_userOrganizations_organization_organization_translations {
  __typename: "OrganizationTranslation"
  language: string
  name: string
  information: string | null
}

export interface UserOrganizations_userOrganizations_organization {
  __typename: "Organization"
  id: string
  slug: string
  hidden: boolean | null
  required_confirmation: boolean | null
  required_organization_email: string | null
  organization_translations: UserOrganizations_userOrganizations_organization_organization_translations[]
}

export interface UserOrganizations_userOrganizations_user_organization_join_confirmations_email_delivery {
  __typename: "EmailDelivery"
  id: string
  email: string | null
  sent: boolean
  error: boolean
  updated_at: any | null
}

export interface UserOrganizations_userOrganizations_user_organization_join_confirmations {
  __typename: "UserOrganizationJoinConfirmation"
  id: string
  email: string
  confirmed: boolean | null
  confirmed_at: any | null
  created_at: any | null
  updated_at: any | null
  expired: boolean | null
  expires_at: any | null
  redirect: string | null
  language: string | null
  email_delivery: UserOrganizations_userOrganizations_user_organization_join_confirmations_email_delivery | null
}

export interface UserOrganizations_userOrganizations {
  __typename: "UserOrganization"
  id: string
  confirmed: boolean | null
  consented: boolean | null
  organization: UserOrganizations_userOrganizations_organization | null
  user_organization_join_confirmations: UserOrganizations_userOrganizations_user_organization_join_confirmations[]
}

export interface UserOrganizations {
  userOrganizations: (UserOrganizations_userOrganizations | null)[] | null
}
