import { gql } from "@apollo/client"

export const VerifiedUsersFragment = gql`
  fragment VerifiedUsersFragment on User {
    verified_users {
      id
      home_organization
      person_affiliation
      person_affiliation_updated_at
      updated_at
      created_at
      personal_unique_code
      display_name
      mail
      organizational_unit
      edu_person_principal_name
    }
  }
`
