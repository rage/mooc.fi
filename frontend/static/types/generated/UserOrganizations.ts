/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserOrganizations
// ====================================================

export interface UserOrganizations_userOrganizations_organization {
  __typename: "Organization"
  id: any
}

export interface UserOrganizations_userOrganizations {
  __typename: "UserOrganization"
  id: any
  organization: UserOrganizations_userOrganizations_organization
}

export interface UserOrganizations {
  userOrganizations: UserOrganizations_userOrganizations[]
}

export interface UserOrganizationsVariables {
  user_id?: string | null
}
