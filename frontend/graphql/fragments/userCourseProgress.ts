import { gql } from "@apollo/client"

export const UserCourseProgressFragment = gql`
  fragment UserCourseProgress on UserCourseProgress {
    id
    course_id
    max_points
    n_points
    progress
    extra
    exercise_progress {
      total
      exercises
    }
  }
`

export const ProgressUserCourseProgressFragment = gql`
  fragment ProgressUserCourseProgress on Progress {
    user_course_progress {
      ...UserCourseProgress
    }
  }
  ${UserCourseProgressFragment}
`

export const UserCourseSummaryUserCourseProgressFragment = gql`
  fragment UserCourseSummaryUserCourseProgress on UserCourseSummary {
    user_course_progress {
      ...UserCourseProgress
    }
  }
  ${UserCourseProgressFragment}
`
