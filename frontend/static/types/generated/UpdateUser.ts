/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser {
  __typename: "User"
  id: string
  first_name: string | null
  last_name: string | null
  upstream_id: number
}

export interface UpdateUser {
  updateUser: UpdateUser_updateUser | null
}

export interface UpdateUserVariables {
  first_name?: string | null
  last_name?: string | null
  upstream_id?: number | null
}
