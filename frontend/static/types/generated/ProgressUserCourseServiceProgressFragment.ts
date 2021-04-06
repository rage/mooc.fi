/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProgressUserCourseServiceProgressFragment
// ====================================================

export interface ProgressUserCourseServiceProgressFragment_user_course_service_progresses_service {
  __typename: "Service"
  name: string
  id: string
}

export interface ProgressUserCourseServiceProgressFragment_user_course_service_progresses {
  __typename: "UserCourseServiceProgress"
  progress: (any | null)[] | null
  service: ProgressUserCourseServiceProgressFragment_user_course_service_progresses_service | null
}

export interface ProgressUserCourseServiceProgressFragment {
  __typename: "Progress"
  user_course_service_progresses:
    | (ProgressUserCourseServiceProgressFragment_user_course_service_progresses | null)[]
    | null
}
