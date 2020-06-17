/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserCompletions
// ====================================================

export interface UserCompletions_completions_course_photo {
  __typename: "image"
  id: string
  uncompressed: string
}

export interface UserCompletions_completions_course {
  __typename: "course"
  id: string
  slug: string
  name: string
  photo: UserCompletions_completions_course_photo | null
  has_certificate: boolean | null
}

export interface UserCompletions_completions_completion_registered_organization {
  __typename: "organization"
  slug: string
}

export interface UserCompletions_completions_completion_registered {
  __typename: "completion_registered"
  id: string
  created_at: any | null
  organization: UserCompletions_completions_completion_registered_organization | null
}

export interface UserCompletions_completions {
  __typename: "completion"
  id: string
  completion_language: string | null
  student_number: string | null
  created_at: any | null
  course: UserCompletions_completions_course | null
  completion_registered: UserCompletions_completions_completion_registered[]
}

export interface UserCompletions {
  __typename: "user"
  completions: UserCompletions_completions[]
}
