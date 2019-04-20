/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Slots
// ====================================================

export interface Slots_slots {
  __typename: "Slot";
  id: string;
  capacity: number;
  registered_count: number;
  starts_at: any;
  ends_at: any;
}

export interface Slots_currentUser_slot {
  __typename: "Slot";
  id: string;
}

export interface Slots_currentUser {
  __typename: "User";
  id: string;
  slot: Slots_currentUser_slot | null;
}

export interface Slots {
  slots: Slots_slots[];
  currentUser: Slots_currentUser;
}
