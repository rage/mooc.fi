/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserSlotInfo
// ====================================================

export interface UserSlotInfo_currentUser_slot {
  __typename: "Slot";
  id: string;
}

export interface UserSlotInfo_currentUser_essays {
  __typename: "Essay";
  id: string;
}

export interface UserSlotInfo_currentUser {
  __typename: "User";
  id: string;
  slot: UserSlotInfo_currentUser_slot | null;
  essays: UserSlotInfo_currentUser_essays[] | null;
}

export interface UserSlotInfo {
  currentUser: UserSlotInfo_currentUser;
}
