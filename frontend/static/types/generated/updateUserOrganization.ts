/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateUserOrganization
// ====================================================

export interface updateUserOrganization_updateUserOrganization {
  __typename: "UserOrganization"
  id: string
  consented: boolean | null
}

export interface updateUserOrganization {
  updateUserOrganization: updateUserOrganization_updateUserOrganization | null
}

export interface updateUserOrganizationVariables {
  id: string
  consented: boolean
}
