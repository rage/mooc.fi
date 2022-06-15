/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserOrganizations
// ====================================================

export interface CurrentUserOrganizations_currentUser_user_organizations_organization_organization_translations {
  __typename: "OrganizationTranslation"
  language: string
  name: string
  information: string | null
}

export interface CurrentUserOrganizations_currentUser_user_organizations_organization {
  __typename: "Organization"
  id: string
  slug: string
  hidden: boolean | null
  required_confirmation: boolean | null
  required_organization_email: string | null
  organization_translations: CurrentUserOrganizations_currentUser_user_organizations_organization_organization_translations[]
}

export interface CurrentUserOrganizations_currentUser_user_organizations_user_organization_join_confirmations_email_delivery {
  __typename: "EmailDelivery"
  id: string
  email: string | null
  sent: boolean
  error: boolean
  updated_at: any | null
}

export interface CurrentUserOrganizations_currentUser_user_organizations_user_organization_join_confirmations {
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
  email_delivery: CurrentUserOrganizations_currentUser_user_organizations_user_organization_join_confirmations_email_delivery | null
}

export interface CurrentUserOrganizations_currentUser_user_organizations {
  __typename: "UserOrganization"
  id: string
  confirmed: boolean | null
  consented: boolean | null
  organization: CurrentUserOrganizations_currentUser_user_organizations_organization | null
  user_organization_join_confirmations: CurrentUserOrganizations_currentUser_user_organizations_user_organization_join_confirmations[]
}

export interface CurrentUserOrganizations_currentUser {
  __typename: "User"
  user_organizations: CurrentUserOrganizations_currentUser_user_organizations[]
}

export interface CurrentUserOrganizations {
  currentUser: CurrentUserOrganizations_currentUser | null
}
