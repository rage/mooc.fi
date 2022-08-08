import { gql } from "@apollo/client"

import { CompletionDetailedFieldsFragment } from "/graphql/fragments/completion"
import { CourseWithPhotoCoreFieldsFragment } from "/graphql/fragments/course"
import { ExerciseCoreFieldsFragment } from "/graphql/fragments/exercise"
import { ExerciseCompletionCoreFieldsFragment } from "/graphql/fragments/exerciseCompletion"
import { UserCourseProgressCoreFieldsFragment } from "/graphql/fragments/userCourseProgress"
import { UserCourseServiceProgressCoreFieldsFragment } from "/graphql/fragments/userCourseServiceProgress"

export const UserCourseSummaryCourseFieldsFragment = gql`
  fragment UserCourseSummaryCourseFields on Course {
    ...CourseWithPhotoCoreFields
    has_certificate
    exercises {
      ...ExerciseCoreFields
    }
  }
  ${CourseWithPhotoCoreFieldsFragment}
  ${ExerciseCoreFieldsFragment}
`

export const UserCourseSummaryCoreFieldsFragment = gql`
  fragment UserCourseSummaryCoreFields on UserCourseSummary {
    course {
      ...UserCourseSummaryCourseFields
    }
    exercise_completions {
      ...ExerciseCompletionCoreFields
    }
    user_course_progress {
      ...UserCourseProgressCoreFields
    }
    user_course_service_progresses {
      ...UserCourseServiceProgressCoreFields
    }
    completion {
      ...CompletionDetailedFields
    }
  }
  ${ExerciseCompletionCoreFieldsFragment}
  ${UserCourseProgressCoreFieldsFragment}
  ${UserCourseServiceProgressCoreFieldsFragment}
  ${CompletionDetailedFieldsFragment}
`
