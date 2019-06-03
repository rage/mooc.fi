/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MoreCompletions
// ====================================================

export interface MoreCompletions_completions_user {
  __typename: "User";
  first_name: string | null;
  last_name: string | null;
  student_number: string | null;
}

export interface MoreCompletions_completions {
  __typename: "Completion";
  id: any;
  email: string;
  completion_language: string | null;
  created_at: any | null;
  user: MoreCompletions_completions_user;
}

export interface MoreCompletions {
  completions: MoreCompletions_completions[];
}

export interface MoreCompletionsVariables {
  course?: string | null;
  cursor?: string | null;
}
