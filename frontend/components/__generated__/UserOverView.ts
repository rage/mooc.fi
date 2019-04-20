/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserOverView
// ====================================================

export interface UserOverView_currentUser_slot {
  __typename: "Slot";
  id: string;
}

export interface UserOverView_currentUser_essays {
  __typename: "Essay";
  id: string;
}

export interface UserOverView_currentUser {
  __typename: "User";
  id: string;
  upstream_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  slot: UserOverView_currentUser_slot | null;
  essays: UserOverView_currentUser_essays[] | null;
}

export interface UserOverView {
  currentUser: UserOverView_currentUser;
}
