import { gql } from "@apollo/client"

import { CompletionsQueryConnectionFieldsFragment } from "/graphql/fragments/completion"

export const PaginatedCompletionsQuery = gql`
  query PaginatedCompletions(
    $course: String!
    $cursor: String
    $completionLanguage: String
    $search: String
  ) {
    completionsPaginated(
      course: $course
      completion_language: $completionLanguage
      search: $search
      first: 50
      after: $cursor
    ) {
      ...CompletionsQueryConnectionFields
    }
  }
  ${CompletionsQueryConnectionFieldsFragment}
`

export const PaginatedCompletionsPreviousPageQuery = gql`
  query PaginatedCompletionsPreviousPage(
    $course: String!
    $cursor: String
    $completionLanguage: String
    $search: String
  ) {
    completionsPaginated(
      course: $course
      completion_language: $completionLanguage
      search: $search
      last: 50
      before: $cursor
    ) {
      ...CompletionsQueryConnectionFields
    }
  }
  ${CompletionsQueryConnectionFieldsFragment}
`
