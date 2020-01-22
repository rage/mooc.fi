/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CompletionCourseDetails
// ====================================================

export interface CompletionCourseDetails_course {
  __typename: "Course"
  id: any
  name: string
}

export interface CompletionCourseDetails {
  course: CompletionCourseDetails_course | null
}

export interface CompletionCourseDetailsVariables {
  slug?: string | null
}
