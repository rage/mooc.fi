/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserPointsFragment
// ====================================================

export interface UserPointsFragment_progresses_course {
  __typename: "course"
  name: string
  id: string
}

export interface UserPointsFragment_progresses_user_course_progress_exercise_progress {
  __typename: "exercise_progress"
  total: number | null
  exercises: number | null
}

export interface UserPointsFragment_progresses_user_course_progress_user {
  __typename: "user"
  first_name: string | null
  last_name: string | null
  username: string
  email: string
  real_student_number: string | null
}

export interface UserPointsFragment_progresses_user_course_progress {
  __typename: "user_course_progress"
  progress: any[] | null
  exercise_progress: UserPointsFragment_progresses_user_course_progress_exercise_progress | null
  user: UserPointsFragment_progresses_user_course_progress_user | null
}

export interface UserPointsFragment_progresses_user_course_service_progresses_service {
  __typename: "service"
  name: string
  id: string
}

export interface UserPointsFragment_progresses_user_course_service_progresses {
  __typename: "user_course_service_progress"
  progress: any[] | null
  service: UserPointsFragment_progresses_user_course_service_progresses_service | null
}

export interface UserPointsFragment_progresses {
  __typename: "progress"
  course: UserPointsFragment_progresses_course | null
  user_course_progress: UserPointsFragment_progresses_user_course_progress | null
  user_course_service_progresses:
    | UserPointsFragment_progresses_user_course_service_progresses[]
    | null
}

export interface UserPointsFragment {
  __typename: "user"
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  student_number: string | null
  progresses: UserPointsFragment_progresses[]
}
