import { gql } from "@apollo/client"

import { CompletionCourseFragment } from "/graphql/fragments/completion"
import { CompletionsRegisteredFragment } from "/graphql/fragments/completionsRegistered"
import { UserCourseSummaryUserCourseProgressFragment } from "/graphql/fragments/userCourseProgress"
import { UserCourseSummaryUserCourseServiceProgressFragment } from "/graphql/fragments/userCourseServiceProgress"

export const UserSummaryQuery = gql`
  query UserSummary($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      id
      username
      user_course_summary {
        course {
          id
          name
          slug
          has_certificate
          photo {
            id
            uncompressed
          }
          exercises {
            id
            name
            custom_id
            course_id
            part
            section
            max_points
            deleted
          }
        }
        exercise_completions {
          id
          exercise_id
          created_at
          updated_at
          attempted
          completed
          timestamp
          n_points
          exercise_completion_required_actions {
            id
            value
          }
        }
        ...UserCourseSummaryUserCourseProgress
        ...UserCourseSummaryUserCourseServiceProgress
        completion {
          id
          course_id
          created_at
          updated_at
          tier
          grade
          project_completion
          completion_language
          completion_date
          registered
          eligible_for_ects
          student_number
          email
          ...CompletionsRegistered
        }
      }
    }
  }
  ${CompletionsRegisteredFragment}
  ${UserCourseSummaryUserCourseProgressFragment}
  ${UserCourseSummaryUserCourseServiceProgressFragment}
`

export const UserOverViewQuery = gql`
  query CurrentUserUserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
      completions {
        id
        completion_language
        student_number
        created_at
        tier
        eligible_for_ects
        completion_date
        registered
        ...CompletionCourse
        ...CompletionsRegistered
      }
      research_consent
    }
  }
  ${CompletionCourseFragment}
  ${CompletionsRegisteredFragment}
`
