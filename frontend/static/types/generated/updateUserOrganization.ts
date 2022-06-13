/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrganizationRole } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: updateUserOrganization
// ====================================================

export interface updateUserOrganization_updateUserOrganization {
  __typename: "UserOrganization"
  id: string
  role: OrganizationRole | null
  consented: boolean | null
}

export interface updateUserOrganization {
  updateUserOrganization: updateUserOrganization_updateUserOrganization | null
}

export interface updateUserOrganizationVariables {
  id: string
  role?: OrganizationRole | null
  consented?: boolean | null
}
