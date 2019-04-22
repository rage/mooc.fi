/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChooseSlot
// ====================================================

export interface ChooseSlot_chooseSlot_slot {
  __typename: "Slot";
  id: string;
  registered_count: number;
  capacity: number;
}

export interface ChooseSlot_chooseSlot {
  __typename: "User";
  id: string;
  slot: ChooseSlot_chooseSlot_slot | null;
}

export interface ChooseSlot {
  chooseSlot: ChooseSlot_chooseSlot;
}

export interface ChooseSlotVariables {
  id?: string | null;
}
