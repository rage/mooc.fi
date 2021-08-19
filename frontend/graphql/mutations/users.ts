import { gql } from "@apollo/client"

export const UpdateUserMutation = gql`
  mutation UpdateUser(
    $first_name: String
    $last_name: String
    $upstream_id: Int
  ) {
    updateUser(
      first_name: $first_name
      last_name: $last_name
      upstream_id: $upstream_id
    ) {
      id
      first_name
      last_name
      upstream_id
    }
  }
`
