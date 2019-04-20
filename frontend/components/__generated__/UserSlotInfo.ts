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

export interface UserSlotInfo_currentUser {
  __typename: "User";
  id: string;
  slot: UserSlotInfo_currentUser_slot | null;
}

export interface UserSlotInfo {
  currentUser: UserSlotInfo_currentUser;
}
