import { gql } from "@apollo/client"

const UserPointsQuery = gql`
  query UserPointsList($id: ID!) {
    user(id: $id) {
      id
      username
      exercise_completions {
        id
        created_at
        updated_at
        n_points
        attempted
        completed
        timestamp
        exercise_completion_required_actions {
          id
          value
        }
        exercise {
          id
          custom_id
          course {
            id
            name
          }
          name
        }
      }
    }
  }
`
