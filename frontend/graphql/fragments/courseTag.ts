import { gql } from "@apollo/client"

export const CourseTagFragment = gql`
  fragment CourseTagFragment on CourseTag {
    tag {
      id
      color
      tag_translations {
        language
        name
        description
      }
    }
  }
`
