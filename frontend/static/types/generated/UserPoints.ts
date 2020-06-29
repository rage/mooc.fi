/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPoints
// ====================================================

export interface UserPoints_currentUser_progresses_course {
  __typename: "course"
  name: string
  id: string
}

export interface UserPoints_currentUser_progresses_user_course_progress_exercise_progress {
  __typename: "exercise_progress"
  total: number | null
  exercises: number | null
}

export interface UserPoints_currentUser_progresses_user_course_progress_user {
  __typename: "user"
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  real_student_number: string | null
}

export interface UserPoints_currentUser_progresses_user_course_progress {
  __typename: "user_course_progress"
  progress: any[] | null
  exercise_progress: UserPoints_currentUser_progresses_user_course_progress_exercise_progress | null
  user: UserPoints_currentUser_progresses_user_course_progress_user | null
}

export interface UserPoints_currentUser_progresses_user_course_service_progresses_service {
  __typename: "service"
  name: string
  id: string
}

export interface UserPoints_currentUser_progresses_user_course_service_progresses {
  __typename: "user_course_service_progress"
  progress: any[] | null
  service: UserPoints_currentUser_progresses_user_course_service_progresses_service | null
}

export interface UserPoints_currentUser_progresses {
  __typename: "progress"
  course: UserPoints_currentUser_progresses_course | null
  user_course_progress: UserPoints_currentUser_progresses_user_course_progress | null
  user_course_service_progresses:
    | UserPoints_currentUser_progresses_user_course_service_progresses[]
    | null
}

export interface UserPoints_currentUser {
  __typename: "user"
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  student_number: string | null
  progresses: UserPoints_currentUser_progresses[]
}

export interface UserPoints {
  currentUser: UserPoints_currentUser | null
}
