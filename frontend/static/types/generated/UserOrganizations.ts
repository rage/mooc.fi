/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserOrganizations
// ====================================================

export interface UserOrganizations_userOrganizations_organization {
  __typename: "Organization"
  id: string
}

export interface UserOrganizations_userOrganizations_user_organization_join_confirmations_email_delivery {
  __typename: "EmailDelivery"
  id: string
  sent: boolean
  updated_at: any | null
}

export interface UserOrganizations_userOrganizations_user_organization_join_confirmations {
  __typename: "UserOrganizationJoinConfirmation"
  id: string
  confirmed: boolean | null
  confirmed_at: any | null
  created_at: any | null
  updated_at: any | null
  expired: boolean | null
  expires_at: any | null
  email_delivery: UserOrganizations_userOrganizations_user_organization_join_confirmations_email_delivery | null
}

export interface UserOrganizations_userOrganizations {
  __typename: "UserOrganization"
  id: string
  confirmed: boolean | null
  organization: UserOrganizations_userOrganizations_organization | null
  user_organization_join_confirmations: UserOrganizations_userOrganizations_user_organization_join_confirmations[]
}

export interface UserOrganizations {
  userOrganizations: (UserOrganizations_userOrganizations | null)[] | null
}
