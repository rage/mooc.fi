import { gql } from "@apollo/client"

export const CoursePhotoFragment = gql`
  fragment CoursePhoto on Course {
    photo {
      id
      compressed
      uncompressed
    }
  }
`
