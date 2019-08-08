/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserOverView
// ====================================================

export interface UserOverView_currentUser_completions_course {
  __typename: "Course";
  id: any;
  slug: string;
  name: string;
}

export interface UserOverView_currentUser_completions_completions_registered_organization {
  __typename: "Organization";
  slug: string;
}

export interface UserOverView_currentUser_completions_completions_registered {
  __typename: "CompletionRegistered";
  id: any;
  created_at: any | null;
  organization: UserOverView_currentUser_completions_completions_registered_organization | null;
}

export interface UserOverView_currentUser_completions {
  __typename: "Completion";
  id: any;
  completion_language: string | null;
  student_number: string | null;
  created_at: any | null;
  course: UserOverView_currentUser_completions_course;
  completions_registered: UserOverView_currentUser_completions_completions_registered[] | null;
}

export interface UserOverView_currentUser {
  __typename: "User";
  id: any;
  upstream_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  completions: UserOverView_currentUser_completions[] | null;
}

export interface UserOverView {
  currentUser: UserOverView_currentUser | null;
}
