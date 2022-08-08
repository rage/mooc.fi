import { gql } from "@apollo/client"

export const ExerciseCompletionCoreFieldsFragment = gql`
  fragment ExerciseCompletionCoreFields on ExerciseCompletion {
    id
    exercise_id
    user_id
    created_at
    updated_at
    attempted
    completed
    timestamp
    n_points
    exercise_completion_required_actions {
      id
      exercise_completion_id
      value
    }
  }
`
