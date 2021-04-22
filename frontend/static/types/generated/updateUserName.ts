/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateUserName
// ====================================================

export interface updateUserName_updateUserName {
  __typename: "User"
  id: string
  first_name: string | null
  last_name: string | null
}

export interface updateUserName {
  updateUserName: updateUserName_updateUserName | null
}

export interface updateUserNameVariables {
  first_name?: string | null
  last_name?: string | null
}
