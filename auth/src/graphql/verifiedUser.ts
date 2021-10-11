import { gql } from "graphql-request"

export const VERIFIED_USER_MUTATION = gql`
  mutation addVerifiedUser(
    $display_name: String
    $personal_unique_code: String!
    $home_organization: String!
    $person_affiliation: String!
    $mail: String!
    $organizational_unit: String!
    $edu_person_principal_name: $String!
  ) {
    addVerifiedUser(
      verified_user: {
        display_name: $display_name
        personal_unique_code: $personal_unique_code
        home_organization: $home_organization
        person_affiliation: $person_affiliation
        mail: $mail
        organizational_unit: $organizational_unit
        edu_person_principal_name: $edu_person_principal_name
      }
    ) {
      id
      edu_person_principal_name
    }
  }
`

export const VERIFIED_USER_QUERY = gql`
  query verifiedUser($edu_person_principal_name: String!) {
    verifiedUser(edu_person_principal_name: $edu_person_principal_name) {
      id
      user {
        id
      }
    }
  }
`
