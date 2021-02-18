/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserCompletions
// ====================================================

export interface UserCompletions_completions_course_photo {
  __typename: "Image";
  id: string;
  uncompressed: string;
}

export interface UserCompletions_completions_course {
  __typename: "Course";
  id: string;
  slug: string;
  name: string;
  photo: UserCompletions_completions_course_photo | null;
  has_certificate: boolean | null;
}

export interface UserCompletions_completions_completions_registered_organization {
  __typename: "Organization";
  slug: string;
}

export interface UserCompletions_completions_completions_registered {
  __typename: "CompletionRegistered";
  id: string;
  created_at: any | null;
  organization: UserCompletions_completions_completions_registered_organization | null;
}

export interface UserCompletions_completions {
  __typename: "Completion";
  id: string;
  completion_language: string | null;
  student_number: string | null;
  created_at: any | null;
  tier: number | null;
  eligible_for_ects: boolean | null;
  course: UserCompletions_completions_course | null;
  completions_registered: UserCompletions_completions_completions_registered[];
}

export interface UserCompletions {
  __typename: "User";
  completions: UserCompletions_completions[] | null;
}
