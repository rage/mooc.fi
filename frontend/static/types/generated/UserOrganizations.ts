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

export interface UserOrganizations_userOrganizations {
  __typename: "UserOrganization"
  id: string
  organization: UserOrganizations_userOrganizations_organization | null
}

export interface UserOrganizations {
  userOrganizations: (UserOrganizations_userOrganizations | null)[] | null
}

export interface UserOrganizationsVariables {
  user_id?: string | null
}
