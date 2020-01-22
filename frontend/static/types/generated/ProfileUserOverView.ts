/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProfileUserOverView
// ====================================================

export interface ProfileUserOverView_currentUser_completions_course_photo {
  __typename: "Image"
  uncompressed: string
}

export interface ProfileUserOverView_currentUser_completions_course {
  __typename: "Course"
  id: any
  slug: string
  name: string
  photo: ProfileUserOverView_currentUser_completions_course_photo | null
}

export interface ProfileUserOverView_currentUser_completions_completions_registered_organization {
  __typename: "Organization"
  slug: string
}

export interface ProfileUserOverView_currentUser_completions_completions_registered {
  __typename: "CompletionRegistered"
  id: any
  created_at: any | null
  organization: ProfileUserOverView_currentUser_completions_completions_registered_organization | null
}

export interface ProfileUserOverView_currentUser_completions {
  __typename: "Completion"
  id: any
  completion_language: string | null
  student_number: string | null
  created_at: any | null
  course: ProfileUserOverView_currentUser_completions_course
  completions_registered:
    | ProfileUserOverView_currentUser_completions_completions_registered[]
    | null
}

export interface ProfileUserOverView_currentUser {
  __typename: "User"
  id: any
  upstream_id: number
  first_name: string | null
  last_name: string | null
  student_number: string | null
  email: string
  completions: ProfileUserOverView_currentUser_completions[] | null
}

export interface ProfileUserOverView {
  currentUser: ProfileUserOverView_currentUser | null
}
