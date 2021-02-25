/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatistics
// ====================================================

export interface CourseStatistics_user_course_statistics_course {
  __typename: "Course"
  id: string
  name: string
  has_certificate: boolean | null
}

export interface CourseStatistics_user_course_statistics_exercise_completions_exercise_completion_required_actions {
  __typename: "ExerciseCompletionRequiredAction"
  id: string
  value: string
}

export interface CourseStatistics_user_course_statistics_exercise_completions_exercise_course {
  __typename: "Course"
  id: string
  name: string
}

export interface CourseStatistics_user_course_statistics_exercise_completions_exercise {
  __typename: "Exercise"
  id: string
  name: string | null
  custom_id: string
  course_id: string | null
  course: CourseStatistics_user_course_statistics_exercise_completions_exercise_course | null
  part: number | null
  section: number | null
  max_points: number | null
}

export interface CourseStatistics_user_course_statistics_exercise_completions {
  __typename: "ExerciseCompletion"
  id: string
  created_at: any | null
  updated_at: any | null
  n_points: number | null
  attempted: boolean | null
  completed: boolean | null
  timestamp: any
  exercise_completion_required_actions: CourseStatistics_user_course_statistics_exercise_completions_exercise_completion_required_actions[]
  exercise: CourseStatistics_user_course_statistics_exercise_completions_exercise | null
}

export interface CourseStatistics_user_course_statistics_user_course_progresses {
  __typename: "UserCourseProgress"
  id: string
  course_id: string | null
  max_points: number | null
  n_points: number | null
  progress: (any | null)[] | null
  extra: any | null
}

export interface CourseStatistics_user_course_statistics_completion_course_photo {
  __typename: "Image"
  id: string
  uncompressed: string
}

export interface CourseStatistics_user_course_statistics_completion_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  has_certificate: boolean | null
  photo: CourseStatistics_user_course_statistics_completion_course_photo | null
}

export interface CourseStatistics_user_course_statistics_completion_completions_registered_organization {
  __typename: "Organization"
  id: string
  slug: string
}

export interface CourseStatistics_user_course_statistics_completion_completions_registered {
  __typename: "CompletionRegistered"
  id: string
  created_at: any | null
  organization: CourseStatistics_user_course_statistics_completion_completions_registered_organization | null
}

export interface CourseStatistics_user_course_statistics_completion {
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
  course: CourseStatistics_user_course_statistics_completion_course | null
  completions_registered: CourseStatistics_user_course_statistics_completion_completions_registered[]
}

export interface CourseStatistics_user_course_statistics {
  __typename: "CourseStatistics"
  course: CourseStatistics_user_course_statistics_course | null
  exercise_completions:
    | (CourseStatistics_user_course_statistics_exercise_completions | null)[]
    | null
  user_course_progresses:
    | (CourseStatistics_user_course_statistics_user_course_progresses | null)[]
    | null
  completion: CourseStatistics_user_course_statistics_completion | null
}

export interface CourseStatistics_user {
  __typename: "User"
  id: string
  username: string
  course_statistics: (CourseStatistics_user_course_statistics | null)[] | null
}

export interface CourseStatistics {
  user: CourseStatistics_user | null
}

export interface CourseStatisticsVariables {
  upstream_id?: number | null
}
