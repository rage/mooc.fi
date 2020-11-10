/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addUserOrganization
// ====================================================

export interface addUserOrganization_addUserOrganization {
  __typename: "UserOrganization"
  id: string
}

export interface addUserOrganization {
  addUserOrganization: addUserOrganization_addUserOrganization | null
}

export interface addUserOrganizationVariables {
  user_id: string
  organization_id: string
}
