/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CourseEmailDetailsFragment
// ====================================================

export interface CourseEmailDetailsFragment_completion_email {
  __typename: "EmailTemplate"
  name: string | null
  id: string
}

export interface CourseEmailDetailsFragment_course_stats_email {
  __typename: "EmailTemplate"
  id: string
  name: string | null
}

export interface CourseEmailDetailsFragment {
  __typename: "Course"
  id: string
  slug: string
  name: string
  teacher_in_charge_name: string
  teacher_in_charge_email: string
  start_date: string
  completion_email: CourseEmailDetailsFragment_completion_email | null
  course_stats_email: CourseEmailDetailsFragment_course_stats_email | null
}
