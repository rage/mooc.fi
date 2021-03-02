/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CourseStatisticsUserCourseServiceProgressFragment
// ====================================================

export interface CourseStatisticsUserCourseServiceProgressFragment_user_course_service_progresses_service {
  __typename: "Service"
  name: string
  id: string
}

export interface CourseStatisticsUserCourseServiceProgressFragment_user_course_service_progresses {
  __typename: "UserCourseServiceProgress"
  progress: (any | null)[] | null
  service: CourseStatisticsUserCourseServiceProgressFragment_user_course_service_progresses_service | null
}

export interface CourseStatisticsUserCourseServiceProgressFragment {
  __typename: "CourseStatistics"
  user_course_service_progresses:
    | (CourseStatisticsUserCourseServiceProgressFragment_user_course_service_progresses | null)[]
    | null
}
