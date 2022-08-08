import { gql } from "@apollo/client"

import { CompletionCoreFieldsFragment } from "/graphql/fragments/completion"
import { UserCoreFieldsFragment } from "/graphql/fragments/user"

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

export const RecheckCompletionsMutation = gql`
  mutation RecheckCompletions($slug: String) {
    recheckCompletions(slug: $slug)
  }
`

export const AddManualCompletionMutation = gql`
  mutation AddManualCompletion(
    $course_id: String!
    $completions: [ManualCompletionArg!]
  ) {
    addManualCompletion(course_id: $course_id, completions: $completions) {
      ...CompletionCoreFields
      user {
        ...UserCoreFields
      }
    }
  }
  ${CompletionCoreFieldsFragment}
  ${UserCoreFieldsFragment}
`
