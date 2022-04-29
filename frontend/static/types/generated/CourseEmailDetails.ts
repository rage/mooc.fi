/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseEmailDetails
// ====================================================

export interface CourseEmailDetails_course_completion_email {
  __typename: "EmailTemplate"
  name: string | null
  id: string
}

export interface CourseEmailDetails_course_course_stats_email {
  __typename: "EmailTemplate"
  id: string
  name: string | null
}

export interface CourseEmailDetails_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  teacher_in_charge_name: string
  teacher_in_charge_email: string
  start_date: string
  completion_email: CourseEmailDetails_course_completion_email | null
  course_stats_email: CourseEmailDetails_course_course_stats_email | null
}

export interface CourseEmailDetails {
  course: CourseEmailDetails_course | null
}

export interface CourseEmailDetailsVariables {
  slug?: string | null
}
