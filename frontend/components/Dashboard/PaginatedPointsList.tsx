import React from "react"
import { gql } from "apollo-boost"
import ErrorBoundary from "../ErrorBoundary"
import { useQuery } from "@apollo/react-hooks"
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

function PaginatedPointsList(props: Props) {
  const { courseID } = props

  const { data, loading, error } = useQuery<StudentProgressData>(
    StudentProgresses,
    { variables: { course_id: courseID } },
  )

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  if (!data) {
    return <p>no data</p>
  }

  return (
    <ErrorBoundary>
      <PointsList pointsForUser={data.UserCourseSettingses.edges} />
    </ErrorBoundary>
  )
}

export default PaginatedPointsList
