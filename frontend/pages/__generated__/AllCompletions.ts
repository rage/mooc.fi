/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllCompletions
// ====================================================

export interface AllCompletions_completions_user {
  __typename: "User";
  first_name: string | null;
  last_name: string | null;
  student_number: string | null;
}

export interface AllCompletions_completions {
  __typename: "Completion";
  id: any;
  email: string;
  completion_language: string | null;
  created_at: any;
  user: AllCompletions_completions_user;
}

export interface AllCompletions {
  completions: AllCompletions_completions[];
}
