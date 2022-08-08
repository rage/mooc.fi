import { gql } from "@apollo/client"

export const CompletionRegisteredCoreFieldsFragment = gql`
  fragment CompletionRegisteredCoreFields on CompletionRegistered {
    id
    completion_id
    organization_id
    organization {
      id
      slug
    }
    created_at
    updated_at
  }
`
