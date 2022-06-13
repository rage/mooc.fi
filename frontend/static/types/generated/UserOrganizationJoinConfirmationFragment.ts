/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserOrganizationJoinConfirmationFragment
// ====================================================

export interface UserOrganizationJoinConfirmationFragment_email_delivery {
  __typename: "EmailDelivery"
  id: string
  email: string | null
  sent: boolean
  error: boolean
  updated_at: any | null
}

export interface UserOrganizationJoinConfirmationFragment {
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
  email_delivery: UserOrganizationJoinConfirmationFragment_email_delivery | null
}
