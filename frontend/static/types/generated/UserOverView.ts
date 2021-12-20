/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserOverView
// ====================================================

export interface UserOverView_currentUser_verified_users {
  __typename: "VerifiedUser"
  id: string
  home_organization: string
  person_affiliation: string
  person_affiliation_updated_at: any
  updated_at: any | null
  created_at: any | null
  personal_unique_code: string
  display_name: string | null
  mail: string
  organizational_unit: string
  edu_person_principal_name: string
}

export interface UserOverView_currentUser {
  __typename: "User"
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  upstream_id: number
  administrator: boolean
  verified_users: UserOverView_currentUser_verified_users[]
}

export interface UserOverView {
  currentUser: UserOverView_currentUser | null
}
