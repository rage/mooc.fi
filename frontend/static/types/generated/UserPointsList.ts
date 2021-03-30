/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPointsList
// ====================================================

export interface UserPointsList_user_exercise_completions_exercise_completion_required_actions {
  __typename: "ExerciseCompletionRequiredAction"
  id: string
  value: string
}

export interface UserPointsList_user_exercise_completions_exercise_course {
  __typename: "Course"
  id: string
  name: string
}

export interface UserPointsList_user_exercise_completions_exercise {
  __typename: "Exercise"
  id: string
  custom_id: string
  course: UserPointsList_user_exercise_completions_exercise_course | null
  name: string | null
}

export interface UserPointsList_user_exercise_completions {
  __typename: "ExerciseCompletion"
  id: string
  created_at: any | null
  updated_at: any | null
  n_points: number | null
  attempted: boolean | null
  completed: boolean | null
  timestamp: any
  exercise_completion_required_actions: UserPointsList_user_exercise_completions_exercise_completion_required_actions[]
  exercise: UserPointsList_user_exercise_completions_exercise | null
}

export interface UserPointsList_user {
  __typename: "User"
  id: string
  username: string
  exercise_completions:
    | (UserPointsList_user_exercise_completions | null)[]
    | null
}

export interface UserPointsList {
  user: UserPointsList_user | null
}

export interface UserPointsListVariables {
  id: string
}
