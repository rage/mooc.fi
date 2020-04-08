/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseDetailsFromSlugQuery
// ====================================================

export interface CourseDetailsFromSlugQuery_course_completion_email {
  __typename: "EmailTemplate"
  name: string | null
  id: any
}

export interface CourseDetailsFromSlugQuery_course {
  __typename: "Course"
  id: any
  name: string
  completion_email: CourseDetailsFromSlugQuery_course_completion_email | null
}

export interface CourseDetailsFromSlugQuery {
  course: CourseDetailsFromSlugQuery_course | null
}

export interface CourseDetailsFromSlugQueryVariables {
  slug?: string | null
}
