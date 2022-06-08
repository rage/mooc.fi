/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserOrganizationJoinConfirmation
// ====================================================

export interface UserOrganizationJoinConfirmation_userOrganizationJoinConfirmation_user_organization {
  __typename: "UserOrganization"
  id: string
  user_id: string | null
  organization_id: string | null
  confirmed: boolean | null
}

export interface UserOrganizationJoinConfirmation_userOrganizationJoinConfirmation_email_delivery {
  __typename: "EmailDelivery"
  id: string
  sent: boolean
}

export interface UserOrganizationJoinConfirmation_userOrganizationJoinConfirmation {
  __typename: "UserOrganizationJoinConfirmation"
  id: string
  expired: boolean | null
  expires_at: any | null
  confirmed: boolean | null
  confirmed_at: any | null
  user_organization: UserOrganizationJoinConfirmation_userOrganizationJoinConfirmation_user_organization
  email_delivery: UserOrganizationJoinConfirmation_userOrganizationJoinConfirmation_email_delivery | null
}

export interface UserOrganizationJoinConfirmation {
  userOrganizationJoinConfirmation: UserOrganizationJoinConfirmation_userOrganizationJoinConfirmation | null
}

export interface UserOrganizationJoinConfirmationVariables {
  id: string
}
