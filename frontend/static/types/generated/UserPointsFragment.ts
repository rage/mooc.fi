/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserPointsFragment
// ====================================================

export interface UserPointsFragment_user_course_progresses_course {
  __typename: "Course"
  id: any
  name: string
}

export interface UserPointsFragment_user_course_progresses_user_course_service_progresses_course {
  __typename: "Course"
  id: any
  name: string
}

export interface UserPointsFragment_user_course_progresses_user_course_service_progresses_service {
  __typename: "Service"
  id: any
  name: string
}

export interface UserPointsFragment_user_course_progresses_user_course_service_progresses {
  __typename: "UserCourseServiceProgress"
  course: UserPointsFragment_user_course_progresses_user_course_service_progresses_course
  service: UserPointsFragment_user_course_progresses_user_course_service_progresses_service
  progress: any
}

export interface UserPointsFragment_user_course_progresses {
  __typename: "UserCourseProgress"
  id: any
  course: UserPointsFragment_user_course_progresses_course
  progress: any
  user_course_service_progresses:
    | UserPointsFragment_user_course_progresses_user_course_service_progresses[]
    | null
}

export interface UserPointsFragment {
  __typename: "User"
  id: any
  first_name: string | null
  last_name: string | null
  email: string
  student_number: string | null
  user_course_progresses: UserPointsFragment_user_course_progresses[] | null
}
