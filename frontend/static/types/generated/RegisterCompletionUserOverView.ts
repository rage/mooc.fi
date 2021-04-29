/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: RegisterCompletionUserOverView
// ====================================================

export interface RegisterCompletionUserOverView_currentUser_completions_course {
  __typename: "Course";
  id: string;
  slug: string;
  name: string;
  ects: string | null;
}

export interface RegisterCompletionUserOverView_currentUser_completions_completions_registered_organization {
  __typename: "Organization";
  slug: string;
}

export interface RegisterCompletionUserOverView_currentUser_completions_completions_registered {
  __typename: "CompletionRegistered";
  id: string;
  completion_id: string | null;
  organization: RegisterCompletionUserOverView_currentUser_completions_completions_registered_organization | null;
}

export interface RegisterCompletionUserOverView_currentUser_completions {
  __typename: "Completion";
  id: string;
  email: string;
  completion_language: string | null;
  completion_link: string | null;
  student_number: string | null;
  created_at: any | null;
  course: RegisterCompletionUserOverView_currentUser_completions_course | null;
  completions_registered: RegisterCompletionUserOverView_currentUser_completions_completions_registered[];
  eligible_for_ects: boolean | null;
}

export interface RegisterCompletionUserOverView_currentUser {
  __typename: "User";
  id: string;
  upstream_id: number;
  first_name: string | null;
  last_name: string | null;
  completions: RegisterCompletionUserOverView_currentUser_completions[] | null;
}

export interface RegisterCompletionUserOverView {
  currentUser: RegisterCompletionUserOverView_currentUser | null;
}
