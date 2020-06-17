/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowUserUserOverView
// ====================================================

export interface ShowUserUserOverView_user_completions_course_photo {
  __typename: "image"
  id: string
  uncompressed: string
}

export interface ShowUserUserOverView_user_completions_course {
  __typename: "course"
  id: string
  slug: string
  name: string
  photo: ShowUserUserOverView_user_completions_course_photo | null
  has_certificate: boolean | null
}

export interface ShowUserUserOverView_user_completions_completion_registered_organization {
  __typename: "organization"
  slug: string
}

export interface ShowUserUserOverView_user_completions_completion_registered {
  __typename: "completion_registered"
  id: string
  created_at: any | null
  organization: ShowUserUserOverView_user_completions_completion_registered_organization | null
}

export interface ShowUserUserOverView_user_completions {
  __typename: "completion"
  id: string
  completion_language: string | null
  student_number: string | null
  created_at: any | null
  course: ShowUserUserOverView_user_completions_course | null
  completion_registered: ShowUserUserOverView_user_completions_completion_registered[]
}

export interface ShowUserUserOverView_user {
  __typename: "user"
  id: string
  upstream_id: number
  first_name: string | null
  last_name: string | null
  email: string
  completions: ShowUserUserOverView_user_completions[]
}

export interface ShowUserUserOverView {
  user: ShowUserUserOverView_user | null
}

export interface ShowUserUserOverViewVariables {
  upstream_id?: number | null
}
