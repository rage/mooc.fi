/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrganizationRole } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: updateUserOrganization
// ====================================================

export interface updateUserOrganization_updateUserOrganization {
  __typename: "UserOrganization"
  id: any
}

export interface updateUserOrganization {
  updateUserOrganization: updateUserOrganization_updateUserOrganization
}

export interface updateUserOrganizationVariables {
  id: string
  role?: OrganizationRole | null
}
