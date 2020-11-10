/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserOverView
// ====================================================

export interface UserOverView_currentUser {
  __typename: "User";
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export interface UserOverView {
  currentUser: UserOverView_currentUser | null;
}
