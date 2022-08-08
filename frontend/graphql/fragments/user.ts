import { gql } from "@apollo/client"

import { CompletionDetailedFieldsFragment } from "/graphql/fragments/completion"
import { CourseWithPhotoCoreFieldsFragment } from "/graphql/fragments/course"
import { ProgressCoreFieldsFragment } from "/graphql/fragments/progress"

export const UserCoreFieldsFragment = gql`
  fragment UserCoreFields on User {
    id
    upstream_id
    first_name
    last_name
    username
    email
    student_number
    real_student_number
    created_at
    updated_at
  }
`

export const UserDetailedFieldsFragment = gql`
  fragment UserDetailedFields on User {
    ...UserCoreFields
    administrator
    research_consent
  }
  ${UserCoreFieldsFragment}
`

export const UserProgressesFieldsFragment = gql`
  fragment UserProgressesFields on User {
    ...UserCoreFields
    progresses {
      ...ProgressCoreFields
    }
  }
  ${UserCoreFieldsFragment}
  ${ProgressCoreFieldsFragment}
`

export const UserOverviewFieldsFragment = gql`
  fragment UserOverviewFields on User {
    ...UserDetailedFields
    completions {
      ...CompletionDetailedFields
      course {
        ...CourseWithPhotoCoreFields
        has_certificate
      }
    }
  }
  ${UserDetailedFieldsFragment}
  ${CourseWithPhotoCoreFieldsFragment}
  ${CompletionDetailedFieldsFragment}
`
