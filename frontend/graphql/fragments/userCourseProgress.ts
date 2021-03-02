import { gql } from "@apollo/client"

export const UserCourseProgressFragment = gql`
  fragment UserCourseProgressFragment on UserCourseProgress {
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
  fragment ProgressUserCourseProgressFragment on Progress {
    user_course_progress {
      ...UserCourseProgressFragment
    }
  }
  ${UserCourseProgressFragment}
`

export const CourseStatisticsUserCourseProgressFragment = gql`
  fragment CourseStatisticsUserCourseProgressFragment on CourseStatistics {
    user_course_progress {
      ...UserCourseProgressFragment
    }
  }
  ${UserCourseProgressFragment}
`
