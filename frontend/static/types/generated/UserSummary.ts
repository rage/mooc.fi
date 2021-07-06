/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserSummary
// ====================================================

export interface UserSummary_user_user_course_summary_course_photo {
  __typename: "Image"
  id: string
  uncompressed: string
}

export interface UserSummary_user_user_course_summary_course_exercises {
  __typename: "Exercise"
  id: string
  name: string | null
  custom_id: string
  course_id: string | null
  part: number | null
  section: number | null
  max_points: number | null
  deleted: boolean | null
}

export interface UserSummary_user_user_course_summary_course {
  __typename: "Course"
  id: string
  name: string
  slug: string
  has_certificate: boolean | null
  photo: UserSummary_user_user_course_summary_course_photo | null
  exercises: UserSummary_user_user_course_summary_course_exercises[]
}

export interface UserSummary_user_user_course_summary_exercise_completions_exercise_completion_required_actions {
  __typename: "ExerciseCompletionRequiredAction"
  id: string
  value: string
}

export interface UserSummary_user_user_course_summary_exercise_completions {
  __typename: "ExerciseCompletion"
  id: string
  exercise_id: string | null
  created_at: any | null
  updated_at: any | null
  n_points: number | null
  attempted: boolean | null
  completed: boolean | null
  timestamp: any
  exercise_completion_required_actions: UserSummary_user_user_course_summary_exercise_completions_exercise_completion_required_actions[]
}

export interface UserSummary_user_user_course_summary_user_course_progress_exercise_progress {
  __typename: "ExerciseProgress"
  total: number | null
  exercises: number | null
}

export interface UserSummary_user_user_course_summary_user_course_progress {
  __typename: "UserCourseProgress"
  id: string
  course_id: string | null
  max_points: number | null
  n_points: number | null
  progress: (any | null)[] | null
  extra: any | null
  exercise_progress: UserSummary_user_user_course_summary_user_course_progress_exercise_progress | null
}

export interface UserSummary_user_user_course_summary_user_course_service_progresses_service {
  __typename: "Service"
  name: string
  id: string
}

export interface UserSummary_user_user_course_summary_user_course_service_progresses {
  __typename: "UserCourseServiceProgress"
  progress: (any | null)[] | null
  service: UserSummary_user_user_course_summary_user_course_service_progresses_service | null
}

export interface UserSummary_user_user_course_summary_completion_completions_registered_organization {
  __typename: "Organization"
  slug: string
}

export interface UserSummary_user_user_course_summary_completion_completions_registered {
  __typename: "CompletionRegistered"
  id: string
  created_at: any | null
  organization: UserSummary_user_user_course_summary_completion_completions_registered_organization | null
}

export interface UserSummary_user_user_course_summary_completion {
  __typename: "Completion"
  id: string
  course_id: string | null
  created_at: any | null
  updated_at: any | null
  tier: number | null
  grade: string | null
  project_completion: boolean | null
  completion_language: string | null
  completion_date: any | null
  registered: boolean | null
  eligible_for_ects: boolean | null
  student_number: string | null
  email: string
  completions_registered: UserSummary_user_user_course_summary_completion_completions_registered[]
}

export interface UserSummary_user_user_course_summary {
  __typename: "UserCourseSummary"
  course: UserSummary_user_user_course_summary_course | null
  exercise_completions:
    | (UserSummary_user_user_course_summary_exercise_completions | null)[]
    | null
  user_course_progress: UserSummary_user_user_course_summary_user_course_progress | null
  user_course_service_progresses:
    | (UserSummary_user_user_course_summary_user_course_service_progresses | null)[]
    | null
  completion: UserSummary_user_user_course_summary_completion | null
}

export interface UserSummary_user {
  __typename: "User"
  id: string
  username: string
  user_course_summary: (UserSummary_user_user_course_summary | null)[] | null
}

export interface UserSummary {
  user: UserSummary_user | null
}

export interface UserSummaryVariables {
  upstream_id?: number | null
}
