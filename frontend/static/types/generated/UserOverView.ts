/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrganizationRole } from "./globalTypes"

// ====================================================
// GraphQL query operation: UserOverView
// ====================================================

export interface UserOverView_currentUser_organization_memberships_organization_organization_translations {
  __typename: "OrganizationTranslation"
  id: any
  language: string
  name: string
}

export interface UserOverView_currentUser_organization_memberships_organization {
  __typename: "Organization"
  id: any
  slug: string
  organization_translations:
    | UserOverView_currentUser_organization_memberships_organization_organization_translations[]
    | null
}

export interface UserOverView_currentUser_organization_memberships {
  __typename: "UserOrganization"
  id: any
  organization: UserOverView_currentUser_organization_memberships_organization
  role: OrganizationRole | null
}

export interface UserOverView_currentUser {
  __typename: "User"
  id: any
  first_name: string | null
  last_name: string | null
  email: string
  organization_memberships:
    | UserOverView_currentUser_organization_memberships[]
    | null
}

export interface UserOverView {
  currentUser: UserOverView_currentUser | null
}
