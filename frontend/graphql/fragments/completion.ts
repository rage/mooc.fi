import { gql } from "@apollo/client"

export const CompletionCourseFragment = gql`
  fragment CompletionCourse on Completion {
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
  }
`

export const UserCompletionsFragment = gql`
  fragment UserCompletions on User {
    completions {
      id
      completion_language
      student_number
      created_at
      tier
      eligible_for_ects
      completion_date
      ...CompletionCourse
      completions_registered {
        id
        created_at
        organization {
          slug
        }
      }
    }
  }
  ${CompletionCourseFragment}
`
