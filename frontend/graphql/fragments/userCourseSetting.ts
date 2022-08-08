import { gql } from "@apollo/client"

import { CourseCoreFieldsFragment } from "/graphql/fragments/course"
import { ProgressCoreFieldsFragment } from "/graphql/fragments/progress"
import { UserCoreFieldsFragment } from "/graphql/fragments/user"

export const UserCourseSettingCoreFieldsFragment = gql`
  fragment UserCourseSettingCoreFields on UserCourseSetting {
    id
    user_id
    course_id
    created_at
    updated_at
  }
`

export const UserCourseSettingDetailedFieldsFragment = gql`
  fragment UserCourseSettingDetailedFields on UserCourseSetting {
    ...UserCourseSettingCoreFields
    language
    country
    research
    marketing
    course_variant
    other
  }
  ${UserCourseSettingCoreFieldsFragment}
`

export const StudentProgressesQueryNodeFieldsFragment = gql`
  fragment StudentProgressesQueryNodeFields on UserCourseSetting {
    ...UserCourseSettingCoreFields
    user {
      ...UserCoreFields
      progress(course_id: $course_id) {
        ...ProgressCoreFields
      }
    }
  }
  ${UserCourseSettingCoreFieldsFragment}
  ${UserCoreFieldsFragment}
  ${ProgressCoreFieldsFragment}
`

export const UserProfileUserCourseSettingsQueryNodeFieldsFragment = gql`
  fragment UserProfileUserCourseSettingsQueryNodeFields on UserCourseSetting {
    ...UserCourseSettingDetailedFields
    course {
      ...CourseCoreFields
    }
  }
  ${UserCourseSettingDetailedFieldsFragment}
  ${CourseCoreFieldsFragment}
`
