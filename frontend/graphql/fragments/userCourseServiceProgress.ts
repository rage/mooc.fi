import { gql } from "@apollo/client"

export const UserCourseServiceProgressFragment = gql`
  fragment UserCourseServiceProgressFragment on UserCourseServiceProgress {
    progress
    service {
      name
      id
    }
  }
`
export const ProgressUserCourseServiceProgressFragment = gql`
  fragment ProgressUserCourseServiceProgressFragment on Progress {
    user_course_service_progresses {
      ...UserCourseServiceProgressFragment
    }
  }
  ${UserCourseServiceProgressFragment}
`

export const UserCourseSummaryUserCourseServiceProgressFragment = gql`
  fragment UserCourseSummaryUserCourseServiceProgressFragment on UserCourseSummary {
    user_course_service_progresses {
      ...UserCourseServiceProgressFragment
    }
  }
  ${UserCourseServiceProgressFragment}
`
