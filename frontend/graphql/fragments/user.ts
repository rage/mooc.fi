import { gql } from "@apollo/client"

import { ProgressUserCourseProgressFragment } from "/graphql/fragments/userCourseProgress"
import { ProgressUserCourseServiceProgressFragment } from "/graphql/fragments/userCourseServiceProgress"

export const UserPointsFragment = gql`
  fragment UserPointsFragment on User {
    id
    first_name
    last_name
    email
    student_number
    progresses {
      course {
        name
        id
      }
      ...ProgressUserCourseProgress
      ...ProgressUserCourseServiceProgress
    }
  }
  ${ProgressUserCourseProgressFragment}
  ${ProgressUserCourseServiceProgressFragment}
`
