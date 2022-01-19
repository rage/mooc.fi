/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: VerifiedUsersFragment
// ====================================================

export interface VerifiedUsersFragment_verified_users {
  __typename: "VerifiedUser"
  id: string
  home_organization: string
  person_affiliation: string | null
  person_affiliation_updated_at: any | null
  updated_at: any | null
  created_at: any | null
  personal_unique_code: string
  display_name: string | null
  mail: string
  organizational_unit: string
  edu_person_principal_name: string
}

export interface VerifiedUsersFragment {
  __typename: "User"
  verified_users: VerifiedUsersFragment_verified_users[]
}
