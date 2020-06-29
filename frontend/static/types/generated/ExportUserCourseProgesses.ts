/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ExportUserCourseProgesses
// ====================================================

export interface ExportUserCourseProgesses_userCourseProgresses_user {
  __typename: "user"
  id: string
  email: string
  student_number: string | null
  real_student_number: string | null
  upstream_id: number
  first_name: string | null
  last_name: string | null
}

export interface ExportUserCourseProgesses_userCourseProgresses_UserCourseSettings {
  __typename: "UserCourseSettings"
  course_variant: string | null
  country: string | null
  language: string | null
}

export interface ExportUserCourseProgesses_userCourseProgresses {
  __typename: "user_course_progress"
  id: string
  user: ExportUserCourseProgesses_userCourseProgresses_user | null
  progress: any[] | null
  UserCourseSettings: ExportUserCourseProgesses_userCourseProgresses_UserCourseSettings | null
}

export interface ExportUserCourseProgesses {
  userCourseProgresses: ExportUserCourseProgesses_userCourseProgresses[] | null
}

export interface ExportUserCourseProgessesVariables {
  course_slug: string
  skip?: number | null
  take?: number | null
}
