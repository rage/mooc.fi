import { gql } from "@apollo/client"

export const ExerciseCoreFieldsFragment = gql`
  fragment ExerciseCoreFields on Exercise {
    id
    name
    custom_id
    course_id
    part
    section
    max_points
    deleted
  }
`
