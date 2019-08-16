/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPoints
// ====================================================

export interface UserPoints_currentUser_user_course_progresses_user {
  __typename: "User"
  id: any
  first_name: string | null
  last_name: string | null
  email: string
  student_number: string | null
}

export interface UserPoints_currentUser_user_course_progresses_course {
  __typename: "Course"
  id: any
  name: string
}

export interface UserPoints_currentUser_user_course_progresses_user_course_service_progresses_course {
  __typename: "Course"
  id: any
  name: string
}

export interface UserPoints_currentUser_user_course_progresses_user_course_service_progresses_service {
  __typename: "Service"
  id: any
  name: string
}

export interface UserPoints_currentUser_user_course_progresses_user_course_service_progresses {
  __typename: "UserCourseServiceProgress"
  course: UserPoints_currentUser_user_course_progresses_user_course_service_progresses_course
  service: UserPoints_currentUser_user_course_progresses_user_course_service_progresses_service
  progress: any
}

export interface UserPoints_currentUser_user_course_progresses {
  __typename: "UserCourseProgress"
  id: any
  user: UserPoints_currentUser_user_course_progresses_user
  course: UserPoints_currentUser_user_course_progresses_course
  progress: any
  user_course_service_progresses:
    | UserPoints_currentUser_user_course_progresses_user_course_service_progresses[]
    | null
}

export interface UserPoints_currentUser {
  __typename: "User"
  id: any
  user_course_progresses: UserPoints_currentUser_user_course_progresses[] | null
}

export interface UserPoints {
  currentUser: UserPoints_currentUser | null
}
