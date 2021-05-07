/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProfileUserOverView
// ====================================================

export interface ProfileUserOverView_currentUser_verified_users_organization_organization_translations {
  __typename: "OrganizationTranslation"
  language: string
  name: string
}

export interface ProfileUserOverView_currentUser_verified_users_organization {
  __typename: "Organization"
  slug: string
  organization_translations: ProfileUserOverView_currentUser_verified_users_organization_organization_translations[]
}

export interface ProfileUserOverView_currentUser_verified_users {
  __typename: "VerifiedUser"
  id: string
  organization: ProfileUserOverView_currentUser_verified_users_organization | null
  created_at: any | null
  personal_unique_code: string
  display_name: string | null
}

export interface ProfileUserOverView_currentUser_completions_course_photo {
  __typename: "Image";
  uncompressed: string;
}

export interface ProfileUserOverView_currentUser_completions_course {
  __typename: "Course";
  id: string;
  slug: string;
  name: string;
  photo: ProfileUserOverView_currentUser_completions_course_photo | null;
  has_certificate: boolean | null;
}

export interface ProfileUserOverView_currentUser_completions_completions_registered_organization {
  __typename: "Organization";
  slug: string;
}

export interface ProfileUserOverView_currentUser_completions_completions_registered {
  __typename: "CompletionRegistered";
  id: string;
  created_at: any | null;
  organization: ProfileUserOverView_currentUser_completions_completions_registered_organization | null;
}

export interface ProfileUserOverView_currentUser_completions {
  __typename: "Completion";
  id: string;
  completion_language: string | null;
  student_number: string | null;
  created_at: any | null;
  tier: number | null;
  eligible_for_ects: boolean | null;
  course: ProfileUserOverView_currentUser_completions_course | null;
  completions_registered: ProfileUserOverView_currentUser_completions_completions_registered[];
}

export interface ProfileUserOverView_currentUser {
  __typename: "User";
  id: string;
  upstream_id: number;
  first_name: string | null;
  last_name: string | null;
  student_number: string | null;
  email: string;
  completions: ProfileUserOverView_currentUser_completions[] | null;
  research_consent: boolean | null;
}

export interface ProfileUserOverView {
  currentUser: ProfileUserOverView_currentUser | null;
}
