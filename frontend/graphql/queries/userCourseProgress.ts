import { gql } from "@apollo/client"

import { UserCoreFieldsFragment } from "/graphql/fragments/user"

export const ExportUserCourseProgressesQuery = gql`
  query ExportUserCourseProgresses(
    $course_slug: String!
    $skip: Int
    $take: Int
  ) {
    userCourseProgresses(course_slug: $course_slug, skip: $skip, take: $take) {
      id
      user {
        ...UserCoreFields
      }
      progress
      user_course_settings {
        course_variant
        country
        language
      }
    }
  }
  ${UserCoreFieldsFragment}
`
