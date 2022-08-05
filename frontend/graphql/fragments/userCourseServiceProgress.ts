import { gql } from "@apollo/client"

export const UserCourseServiceProgressFragment = gql`
  fragment UserCourseServiceProgress on UserCourseServiceProgress {
    progress
    service {
      name
      id
    }
  }
`
export const ProgressUserCourseServiceProgressFragment = gql`
  fragment ProgressUserCourseServiceProgress on Progress {
    user_course_service_progresses {
      ...UserCourseServiceProgress
    }
  }
  ${UserCourseServiceProgressFragment}
`

export const UserCourseSummaryUserCourseServiceProgressFragment = gql`
  fragment UserCourseSummaryUserCourseServiceProgress on UserCourseSummary {
    user_course_service_progresses {
      ...UserCourseServiceProgress
    }
  }
  ${UserCourseServiceProgressFragment}
`
