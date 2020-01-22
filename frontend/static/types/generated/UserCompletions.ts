/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserCompletions
// ====================================================

export interface UserCompletions_completions_course_photo {
  __typename: "Image"
  id: any
  uncompressed: string
}

export interface UserCompletions_completions_course {
  __typename: "Course"
  id: any
  slug: string
  name: string
  photo: UserCompletions_completions_course_photo | null
}

export interface UserCompletions_completions_completions_registered_organization {
  __typename: "Organization"
  slug: string
}

export interface UserCompletions_completions_completions_registered {
  __typename: "CompletionRegistered"
  id: any
  created_at: any | null
  organization: UserCompletions_completions_completions_registered_organization | null
}

export interface UserCompletions_completions {
  __typename: "Completion"
  id: any
  completion_language: string | null
  student_number: string | null
  created_at: any | null
  course: UserCompletions_completions_course
  completions_registered:
    | UserCompletions_completions_completions_registered[]
    | null
}

export interface UserCompletions {
  __typename: "User"
  completions: UserCompletions_completions[] | null
}
