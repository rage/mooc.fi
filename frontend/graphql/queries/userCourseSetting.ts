import { gql } from "@apollo/client"

import {
  StudentProgressesQueryNodeFieldsFragment,
  UserProfileUserCourseSettingsQueryNodeFieldsFragment,
} from "/graphql/fragments/userCourseSetting"

export const StudentProgressesQuery = gql`
  query StudentProgresses(
    $course_id: ID!
    $skip: Int
    $after: String
    $search: String
  ) {
    userCourseSettings(
      course_id: $course_id
      first: 15
      after: $after
      skip: $skip
      search: $search
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...StudentProgressesQueryNodeFields
        }
      }
      totalCount
    }
  }
  ${StudentProgressesQueryNodeFieldsFragment}
`

export const UserProfileUserCourseSettingsQuery = gql`
  query UserProfileUserCourseSettings($upstream_id: Int) {
    userCourseSettings(user_upstream_id: $upstream_id, first: 50) {
      edges {
        node {
          ...UserProfileUserCourseSettingsQueryNodeFields
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${UserProfileUserCourseSettingsQueryNodeFieldsFragment}
`
