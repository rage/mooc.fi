/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: confirmUserOrganizationJoin
// ====================================================

export interface confirmUserOrganizationJoin_confirmUserOrganizationJoin_email_delivery {
  __typename: "EmailDelivery"
  id: string
  email: string | null
  sent: boolean
  error: boolean
  updated_at: any | null
}

export interface confirmUserOrganizationJoin_confirmUserOrganizationJoin {
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
  email_delivery: confirmUserOrganizationJoin_confirmUserOrganizationJoin_email_delivery | null
}

export interface confirmUserOrganizationJoin {
  confirmUserOrganizationJoin: confirmUserOrganizationJoin_confirmUserOrganizationJoin | null
}

export interface confirmUserOrganizationJoinVariables {
  id: string
  code: string
}
