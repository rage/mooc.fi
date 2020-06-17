/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { organization_role } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: updateUserOrganization
// ====================================================

export interface updateUserOrganization_updateUserOrganization {
  __typename: "user_organization"
  id: string
}

export interface updateUserOrganization {
  updateUserOrganization: updateUserOrganization_updateUserOrganization | null
}

export interface updateUserOrganizationVariables {
  id: string
  role?: organization_role | null
}
