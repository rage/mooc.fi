import { gql } from "@apollo/client"

export const CreateRegistrationAttemptDateMutation = gql`
  mutation CreateRegistrationAttemptDate(
    $id: ID!
    $completion_registration_attempt_date: DateTime!
  ) {
    createRegistrationAttemptDate(
      id: $id
      completion_registration_attempt_date: $completion_registration_attempt_date
    ) {
      id
      completion_registration_attempt_date
    }
  }
`
