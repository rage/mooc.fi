import { gql } from "@apollo/client"

export const UserCourseServiceProgressCoreFieldsFragment = gql`
  fragment UserCourseServiceProgressCoreFields on UserCourseServiceProgress {
    id
    course_id
    service_id
    user_id
    progress
    service {
      name
      id
    }
    created_at
    updated_at
  }
`
