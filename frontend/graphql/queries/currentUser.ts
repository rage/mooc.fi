import { gql } from "@apollo/client"

export const UserOverViewQuery = gql`
  query CurrentUserUserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
      completions {
        id
        completion_language
        student_number
        created_at
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
        completions_registered {
          id
          created_at
          organization {
            slug
          }
        }
      }
      research_consent
    }
  }
`
