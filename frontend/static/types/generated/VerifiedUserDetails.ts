/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: VerifiedUserDetails
// ====================================================

export interface VerifiedUserDetails_verifiedUser {
  __typename: "VerifiedUser";
  id: string;
  user_id: string | null;
}

export interface VerifiedUserDetails {
  verifiedUser: VerifiedUserDetails_verifiedUser | null;
}

export interface VerifiedUserDetailsVariables {
  personal_unique_code: string;
  secret: string;
}
