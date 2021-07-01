/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserUserOverView
// ====================================================

export interface CurrentUserUserOverView_currentUser_completions_course_photo {
  __typename: "Image";
  id: string;
  uncompressed: string;
}

export interface CurrentUserUserOverView_currentUser_completions_course {
  __typename: "Course";
  id: string;
  slug: string;
  name: string;
  photo: CurrentUserUserOverView_currentUser_completions_course_photo | null;
  has_certificate: boolean | null;
}

export interface CurrentUserUserOverView_currentUser_completions_completions_registered_organization {
  __typename: "Organization";
  slug: string;
}

export interface CurrentUserUserOverView_currentUser_completions_completions_registered {
  __typename: "CompletionRegistered";
  id: string;
  created_at: any | null;
  organization: CurrentUserUserOverView_currentUser_completions_completions_registered_organization | null;
}

export interface CurrentUserUserOverView_currentUser_completions {
  __typename: "Completion";
  id: string;
  completion_language: string | null;
  student_number: string | null;
  created_at: any | null;
  tier: number | null;
  eligible_for_ects: boolean | null;
  course: CurrentUserUserOverView_currentUser_completions_course | null;
  completion_date: any | null;
  registered: boolean | null;
  completions_registered: CurrentUserUserOverView_currentUser_completions_completions_registered[];
}

export interface CurrentUserUserOverView_currentUser {
  __typename: "User";
  id: string;
  upstream_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  completions: CurrentUserUserOverView_currentUser_completions[] | null;
  research_consent: boolean | null;
}

export interface CurrentUserUserOverView {
  currentUser: CurrentUserUserOverView_currentUser | null;
}
