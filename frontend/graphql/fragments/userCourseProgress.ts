import { gql } from "@apollo/client"

export const UserCourseProgressCoreFieldsFragment = gql`
  fragment UserCourseProgressCoreFields on UserCourseProgress {
    id
    course_id
    user_id
    max_points
    n_points
    progress
    extra
    exercise_progress {
      total
      exercises
    }
    created_at
    updated_at
  }
`
