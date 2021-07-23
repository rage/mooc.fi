/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteVerifiedUserTest
// ====================================================

export interface DeleteVerifiedUserTest_deleteVerifiedUser {
  __typename: "VerifiedUser"
  id: string
  personal_unique_code: string
}

export interface DeleteVerifiedUserTest {
  deleteVerifiedUser: DeleteVerifiedUserTest_deleteVerifiedUser | null
}

export interface DeleteVerifiedUserTestVariables {
  personal_unique_code: string
}
