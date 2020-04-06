/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserUserOverView
// ====================================================

export interface CurrentUserUserOverView_currentUser_completions_course_photo {
  __typename: "Image";
  id: any;
  uncompressed: string;
}

export interface CurrentUserUserOverView_currentUser_completions_course {
  __typename: "Course";
  id: any;
  slug: string;
  name: string;
  photo: CurrentUserUserOverView_currentUser_completions_course_photo | null;
}

export interface CurrentUserUserOverView_currentUser_completions_completions_registered_organization {
  __typename: "Organization";
  slug: string;
}

export interface CurrentUserUserOverView_currentUser_completions_completions_registered {
  __typename: "CompletionRegistered";
  id: any;
  created_at: any | null;
  organization: CurrentUserUserOverView_currentUser_completions_completions_registered_organization | null;
}

export interface CurrentUserUserOverView_currentUser_completions {
  __typename: "Completion";
  id: any;
  completion_language: string | null;
  student_number: string | null;
  created_at: any | null;
  course: CurrentUserUserOverView_currentUser_completions_course;
  completions_registered: CurrentUserUserOverView_currentUser_completions_completions_registered[] | null;
}

export interface CurrentUserUserOverView_currentUser {
  __typename: "User";
  id: any;
  upstream_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  completions: CurrentUserUserOverView_currentUser_completions[];
}

export interface CurrentUserUserOverView {
  currentUser: CurrentUserUserOverView_currentUser | null;
}
