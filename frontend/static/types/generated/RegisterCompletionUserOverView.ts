/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: RegisterCompletionUserOverView
// ====================================================

export interface RegisterCompletionUserOverView_currentUser_completions_course {
  __typename: "course"
  id: string
  slug: string
  name: string
  ects: string | null
}

export interface RegisterCompletionUserOverView_currentUser_completions_completion_registered_organization {
  __typename: "organization"
  slug: string
}

export interface RegisterCompletionUserOverView_currentUser_completions_completion_registered {
  __typename: "completion_registered"
  id: string
  created_at: any | null
  organization: RegisterCompletionUserOverView_currentUser_completions_completion_registered_organization | null
}

export interface RegisterCompletionUserOverView_currentUser_completions {
  __typename: "completion"
  id: string
  email: string
  completion_language: string | null
  completion_link: string | null
  student_number: string | null
  created_at: any | null
  course: RegisterCompletionUserOverView_currentUser_completions_course | null
  completion_registered: RegisterCompletionUserOverView_currentUser_completions_completion_registered[]
}

export interface RegisterCompletionUserOverView_currentUser {
  __typename: "user"
  id: string
  upstream_id: number
  first_name: string | null
  last_name: string | null
  completions: RegisterCompletionUserOverView_currentUser_completions[]
}

export interface RegisterCompletionUserOverView {
  currentUser: RegisterCompletionUserOverView_currentUser | null
}
