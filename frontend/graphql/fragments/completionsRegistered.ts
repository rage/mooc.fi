import { gql } from "@apollo/client"

export const CompletionsRegisteredFragment = gql`
  fragment CompletionsRegisteredFragment on Completion {
    completions_registered {
      id
      created_at
      organization {
        slug
      }
    }
  }
`
