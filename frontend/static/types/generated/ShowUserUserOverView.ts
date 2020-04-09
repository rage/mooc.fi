/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowUserUserOverView
// ====================================================

export interface ShowUserUserOverView_user_completions_course_photo {
  __typename: "Image"
  id: any
  uncompressed: string
}

export interface ShowUserUserOverView_user_completions_course {
  __typename: "Course"
  id: any
  slug: string
  name: string
  photo: ShowUserUserOverView_user_completions_course_photo | null
}

export interface ShowUserUserOverView_user_completions_completions_registered_organization {
  __typename: "Organization"
  slug: string
}

export interface ShowUserUserOverView_user_completions_completions_registered {
  __typename: "CompletionRegistered"
  id: any
  created_at: any | null
  organization: ShowUserUserOverView_user_completions_completions_registered_organization | null
}

export interface ShowUserUserOverView_user_completions {
  __typename: "Completion"
  id: any
  completion_language: string | null
  student_number: string | null
  created_at: any | null
  course: ShowUserUserOverView_user_completions_course
  completions_registered:
    | ShowUserUserOverView_user_completions_completions_registered[]
    | null
}

export interface ShowUserUserOverView_user {
  __typename: "User"
  id: any
  upstream_id: number
  first_name: string | null
  last_name: string | null
  email: string
  completions: ShowUserUserOverView_user_completions[]
}

export interface ShowUserUserOverView {
  user: ShowUserUserOverView_user
}

export interface ShowUserUserOverViewVariables {
  upstream_id?: number | null
}
