import React from "react"
import { gql } from "apollo-boost"
import ErrorBoundary from "../ErrorBoundary"
import { Query } from "react-apollo"
import { UserCourseSettingses as StudentProgressData } from "../../static/types/generated/UserCourseSettingses"
import PointsList from "./PointsList"

export const StudentProgresses = gql`
  query UserCourseSettingses($course_id: ID, $cursor: ID) {
    UserCourseSettingses(course_id: $course_id, first: 15, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          user {
            id
            first_name
            last_name
            email
            student_number
            user_course_progressess(course_id: $course_id) {
              id
              progress
            }
          }
        }
      }
    }
  }
`

interface Props {
  courseID: string
  cursor?: string
}

class StudentProgressQuery extends Query<StudentProgressData, {}> {}

function PaginatedPointsList(props: Props) {
  const { courseID } = props
  return (
    <ErrorBoundary>
      <StudentProgressQuery
        query={StudentProgresses}
        variables={{
          course_id: courseID,
        }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <p>Loading...</p>
          }
          if (data) {
            return (
              <PointsList pointsForUser={data.UserCourseSettingses.edges} />
            )
          }
          return <p>Oh noes</p>
        }}
      </StudentProgressQuery>
    </ErrorBoundary>
  )
}

export default PaginatedPointsList
