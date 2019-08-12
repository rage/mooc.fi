import React from "react"
import { gql } from "apollo-boost"
import ErrorBoundary from "../ErrorBoundary"
import PointsList from "./PointsList"
import Button from "@material-ui/core/Button"
import { useQuery } from "react-apollo-hooks"

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
  const { data, loading, error, fetchMore } = useQuery(StudentProgresses, {
    variables: {
      course_id: courseID,
      cursor: null,
    },
    fetchPolicy: "cache-first",
  })

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>ERROR</p>
  }
  return (
    <ErrorBoundary>
      <PointsList pointsForUser={data.UserCourseSettingses.edges} />
      <Button
        onClick={() =>
          fetchMore({
            query: StudentProgresses,
            variables: {
              course_id: courseID,
              cursor: data.UserCourseSettingses.pageInfo.endCursor,
            },

            updateQuery: (previousResult, { fetchMoreResult }) => {
              const previousData = previousResult.UserCourseSettingses.edges
              const newData = fetchMoreResult.UserCourseSettingses.edges
              const newPageInfo = fetchMoreResult.UserCourseSettingses.pageInfo
              return {
                UserCourseSettingses: {
                  pageInfo: {
                    ...newPageInfo,
                    __typename: "PageInfo",
                  },
                  edges: [...previousData, ...newData],
                  __typename: "UserCourseSettingses",
                },
              }
            },
          })
        }
        disabled={!data.UserCourseSettingses.pageInfo.hasNextPage}
      >
        Load more
      </Button>
    </ErrorBoundary>
  )
}

export default PaginatedPointsList
