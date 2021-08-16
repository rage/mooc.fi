import { gql } from "graphql-request"

export const VERIFIED_USER_MUTATION = gql`
  mutation addVerifiedUser(
    $display_name: String
    $personal_unique_code: String!
    $home_organization: String!
    $person_affiliation: String!
    $mail: String!
    $organizational_unit: String!
  ) {
    addVerifiedUser(
      verified_user: {
        display_name: $display_name
        personal_unique_code: $personal_unique_code
        home_organization: $home_organization
        person_affiliation: $person_affiliation
        mail: $mail
        organizational_unit: $organizational_unit
      }
    ) {
      id
      personal_unique_code
    }
  }
`

export const VERIFIED_USER_QUERY = gql`
  query verifiedUser($personal_unique_code: String!) {
    verifiedUser(personal_unique_code: $personal_unique_code) {
      id
      user {
        id
      }
    }
  }
`
