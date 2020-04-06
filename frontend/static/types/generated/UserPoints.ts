/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPoints
// ====================================================

export interface UserPoints_currentUser_progresses_course_exercises {
  __typename: "Exercise"
  id: any
}

export interface UserPoints_currentUser_progresses_course {
  __typename: "Course"
  name: string
  id: any
  exercises: UserPoints_currentUser_progresses_course_exercises[] | null
}

export interface UserPoints_currentUser_progresses_user_course_progress_user_exercise_completions_exercise {
  __typename: "Exercise"
  id: any
}

export interface UserPoints_currentUser_progresses_user_course_progress_user_exercise_completions {
  __typename: "ExerciseCompletion"
  exercise: UserPoints_currentUser_progresses_user_course_progress_user_exercise_completions_exercise
}

export interface UserPoints_currentUser_progresses_user_course_progress_user {
  __typename: "User"
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  real_student_number: string | null
  exercise_completions: UserPoints_currentUser_progresses_user_course_progress_user_exercise_completions[]
}

export interface UserPoints_currentUser_progresses_user_course_progress {
  __typename: "UserCourseProgress"
  progress: any
  user: UserPoints_currentUser_progresses_user_course_progress_user
}

export interface UserPoints_currentUser_progresses_user_course_service_progresses_service {
  __typename: "Service"
  name: string
  id: any
}

export interface UserPoints_currentUser_progresses_user_course_service_progresses {
  __typename: "UserCourseServiceProgress"
  progress: any
  service: UserPoints_currentUser_progresses_user_course_service_progresses_service
}

export interface UserPoints_currentUser_progresses {
  __typename: "Progress"
  course: UserPoints_currentUser_progresses_course
  user_course_progress: UserPoints_currentUser_progresses_user_course_progress | null
  user_course_service_progresses: UserPoints_currentUser_progresses_user_course_service_progresses[]
}

export interface UserPoints_currentUser {
  __typename: "User"
  id: any
  first_name: string | null
  last_name: string | null
  email: string
  student_number: string | null
  progresses: UserPoints_currentUser_progresses[]
}

export interface UserPoints {
  currentUser: UserPoints_currentUser | null
}
