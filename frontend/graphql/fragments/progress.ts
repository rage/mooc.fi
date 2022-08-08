import { gql } from "@apollo/client"

import { CourseCoreFieldsFragment } from "/graphql/fragments/course"
import { UserCourseProgressCoreFieldsFragment } from "/graphql/fragments/userCourseProgress"
import { UserCourseServiceProgressCoreFieldsFragment } from "/graphql/fragments/userCourseServiceProgress"

export const ProgressCoreFieldsFragment = gql`
  fragment ProgressCoreFields on Progress {
    course {
      ...CourseCoreFields
    }
    user_course_progress {
      ...UserCourseProgressCoreFields
    }
    user_course_service_progresses {
      ...UserCourseServiceProgressCoreFields
    }
  }
  ${CourseCoreFieldsFragment}
  ${UserCourseProgressCoreFieldsFragment}
  ${UserCourseServiceProgressCoreFieldsFragment}
`
