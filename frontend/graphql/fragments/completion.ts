import { gql } from "@apollo/client"

import { CompletionRegisteredCoreFieldsFragment } from "/graphql/fragments/completionRegistered"
import {
  CourseCoreFieldsFragment,
  CourseWithPhotoCoreFieldsFragment,
} from "/graphql/fragments/course"
import { UserCoreFieldsFragment } from "/graphql/fragments/user"

export const CompletionCoreFieldsFragment = gql`
  fragment CompletionCoreFields on Completion {
    id
    course_id
    user_id
    email
    student_number
    completion_language
    completion_link
    completion_date
    tier
    grade
    eligible_for_ects
    project_completion
    registered
    created_at
    updated_at
  }
`

export const CompletionCourseFieldsFragment = gql`
  fragment CompletionCourseFields on Course {
    ...CourseWithPhotoCoreFields
    has_certificate
  }
  ${CourseWithPhotoCoreFieldsFragment}
`

export const CompletionDetailedFieldsFragment = gql`
  fragment CompletionDetailedFields on Completion {
    ...CompletionCoreFields
    completions_registered {
      ...CompletionRegisteredCoreFields
    }
  }
  ${CompletionCoreFieldsFragment}
  ${CompletionRegisteredCoreFieldsFragment}
`

export const CompletionDetailedFieldsWithCourseFragment = gql`
  fragment CompletionDetailedFieldsWithCourse on Completion {
    ...CompletionDetailedFields
    course {
      ...CompletionCourseFields
    }
  }
  ${CompletionDetailedFieldsFragment}
  ${CompletionCourseFieldsFragment}
`

export const CompletionsQueryNodeFieldsFragment = gql`
  fragment CompletionsQueryNodeFields on Completion {
    ...CompletionCoreFields
    user {
      ...UserCoreFields
    }
    course {
      ...CourseCoreFields
      id
      name
    }
    completions_registered {
      id
      organization {
        id
        slug
      }
    }
  }
  ${CompletionCoreFieldsFragment}
  ${UserCoreFieldsFragment}
  ${CourseCoreFieldsFragment}
`

export const CompletionsQueryConnectionFieldsFragment = gql`
  fragment CompletionsQueryConnectionFields on QueryCompletionsPaginated_type_Connection {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...CompletionsQueryNodeFields
      }
    }
  }
  ${CompletionsQueryNodeFieldsFragment}
`
