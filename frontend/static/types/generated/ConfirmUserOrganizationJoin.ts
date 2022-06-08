/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ConfirmUserOrganizationJoin
// ====================================================

export interface ConfirmUserOrganizationJoin_confirmUserOrganizationJoin_user_organization {
  __typename: "UserOrganization"
  id: string
  user_id: string | null
  organization_id: string | null
  confirmed: boolean | null
}

export interface ConfirmUserOrganizationJoin_confirmUserOrganizationJoin {
  __typename: "UserOrganizationJoinConfirmation"
  id: string
  confirmed: boolean | null
  confirmed_at: any | null
  user_organization: ConfirmUserOrganizationJoin_confirmUserOrganizationJoin_user_organization
}

export interface ConfirmUserOrganizationJoin {
  confirmUserOrganizationJoin: ConfirmUserOrganizationJoin_confirmUserOrganizationJoin | null
}

export interface ConfirmUserOrganizationJoinVariables {
  id: string
  code: string
}
