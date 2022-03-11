/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ConnectionTest
// ====================================================

export interface ConnectionTest_currentUser_verified_users_organization_organization_translations {
  __typename: "OrganizationTranslation"
  language: string
  name: string
}

export interface ConnectionTest_currentUser_verified_users_organization {
  __typename: "Organization"
  slug: string
  organization_translations: ConnectionTest_currentUser_verified_users_organization_organization_translations[]
}

export interface ConnectionTest_currentUser_verified_users {
  __typename: "VerifiedUser"
  id: string
  organization: ConnectionTest_currentUser_verified_users_organization | null
  created_at: any | null
  personal_unique_code: string
  display_name: string | null
}

export interface ConnectionTest_currentUser {
  __typename: "User"
  id: string
  upstream_id: number
  first_name: string | null
  last_name: string | null
  student_number: string | null
  email: string
  verified_users: ConnectionTest_currentUser_verified_users[]
}

export interface ConnectionTest {
  currentUser: ConnectionTest_currentUser | null
}
