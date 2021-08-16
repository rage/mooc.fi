/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ConnectionTest
// ====================================================

export interface ConnectionTest_currentUser_verified_users {
  __typename: "VerifiedUser"
  id: string
  created_at: any | null
  personal_unique_code: string
  display_name: string | null
  home_organization: string
  person_affiliation: string
  person_affiliation_updated_at: any
  updated_at: any | null
  mail: string
  organizational_unit: string
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
