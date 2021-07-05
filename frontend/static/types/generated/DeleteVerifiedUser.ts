/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteVerifiedUser
// ====================================================

export interface DeleteVerifiedUser_deleteVerifiedUser {
  __typename: "VerifiedUser"
  id: string
  personal_unique_code: string
}

export interface DeleteVerifiedUser {
  deleteVerifiedUser: DeleteVerifiedUser_deleteVerifiedUser | null
}

export interface DeleteVerifiedUserVariables {
  personal_unique_code: string
}
