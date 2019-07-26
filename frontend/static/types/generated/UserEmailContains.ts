/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserEmailContains
// ====================================================

export interface UserEmailContains_userEmailContains {
  __typename: "User"
  id: any
  email: string
  student_number: string | null
  real_student_number: string | null
  upstream_id: number
  first_name: string | null
  last_name: string | null
}

export interface UserEmailContains {
  userEmailContains: UserEmailContains_userEmailContains[]
}

export interface UserEmailContainsVariables {
  email: string
}
