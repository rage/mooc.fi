/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateRegistrationAttemptDate
// ====================================================

export interface CreateRegistrationAttemptDate_createRegistrationAttemptDate {
  __typename: "Completion";
  id: string;
  completion_registration_attempt_date: any | null;
}

export interface CreateRegistrationAttemptDate {
  createRegistrationAttemptDate: CreateRegistrationAttemptDate_createRegistrationAttemptDate | null;
}

export interface CreateRegistrationAttemptDateVariables {
  id: string;
  completion_registration_attempt_date: any;
}
