/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserUserOverView
// ====================================================

export interface CurrentUserUserOverView_currentUser_completions_course_photo {
  __typename: "image"
  id: string
  uncompressed: string
}

export interface CurrentUserUserOverView_currentUser_completions_course {
  __typename: "course"
  id: string
  slug: string
  name: string
  photo: CurrentUserUserOverView_currentUser_completions_course_photo | null
  has_certificate: boolean | null
}

export interface CurrentUserUserOverView_currentUser_completions_completion_registered_organization {
  __typename: "organization"
  slug: string
}

export interface CurrentUserUserOverView_currentUser_completions_completion_registered {
  __typename: "completion_registered"
  id: string
  created_at: any | null
  organization: CurrentUserUserOverView_currentUser_completions_completion_registered_organization | null
}

export interface CurrentUserUserOverView_currentUser_completions {
  __typename: "completion"
  id: string
  completion_language: string | null
  student_number: string | null
  created_at: any | null
  course: CurrentUserUserOverView_currentUser_completions_course | null
  completion_registered: CurrentUserUserOverView_currentUser_completions_completion_registered[]
}

export interface CurrentUserUserOverView_currentUser {
  __typename: "user"
  id: string
  upstream_id: number
  first_name: string | null
  last_name: string | null
  email: string
  completions: CurrentUserUserOverView_currentUser_completions[]
  research_consent: boolean | null
}

export interface CurrentUserUserOverView {
  currentUser: CurrentUserUserOverView_currentUser | null
}
