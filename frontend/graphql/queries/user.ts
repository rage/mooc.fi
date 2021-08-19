import { gql } from "@apollo/client"
import { CompletionsRegisteredFragment } from "/graphql/fragments/completionsRegistered"
import { VerifiedUsersFragment } from "/graphql/fragments/verifiedUsersFragment"

export const UserOverViewQuery = gql`
  query CurrentUserUserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
      administrator
      student_number
      ...VerifiedUsersFragment
      completions {
        id
        completion_language
        student_number
        created_at
        tier
        eligible_for_ects
        course {
          id
          slug
          name
          photo {
            id
            uncompressed
          }
          has_certificate
        }
        completion_date
        registered
        ...CompletionsRegisteredFragment
      }
      research_consent
    }
  }
  ${VerifiedUsersFragment}
  ${CompletionsRegisteredFragment}
`
