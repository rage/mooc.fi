import { gql } from "@apollo/client"

export const UserOverViewQuery = gql`
  query CurrentUserUserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
      student_number
      real_student_number
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

export const UserDetailQuery = gql`
  query UserOverView {
    currentUser {
      id
      first_name
      last_name
      email
      student_number
      real_student_number
    }
  }
`
