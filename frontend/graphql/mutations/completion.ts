import { gql } from "@apollo/client"

export const UpdateRegistrationAttemptDateMutation = gql`
  mutation UpdateRegistrationAttemptDate(
    $id: ID!
    $completion_registration_attempt_date: DateTime!
  ) {
    updateRegistrationAttemptDate(
      id: $id
      completion_registration_attempt_date: $completion_registration_attempt_date
    ) {
      id
      completion_registration_attempt_date
    }
  }
`
