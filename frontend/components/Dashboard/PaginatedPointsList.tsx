import React, { useState } from "react"
import { gql } from "apollo-boost"
import ErrorBoundary from "../ErrorBoundary"
import { useQuery } from "@apollo/react-hooks"
import { UserCourseSettingses as StudentProgressData } from "/static/types/generated/UserCourseSettingses"
import PointsList from "./PointsList"
import Button from "@material-ui/core/Button"
import useDebounce from "/util/useDebounce"
import { TextField } from "@material-ui/core"

export const StudentProgresses = gql`
  query UserCourseSettingses($course_id: ID, $cursor: ID, $search: String) {
    UserCourseSettingses(
      course_id: $course_id
      first: 15
      after: $cursor
      search: $search
    ) {
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
            username
            user_course_progressess(course_id: $course_id) {
              id
              progress
              user_course_service_progresses {
                service {
                  id
                }
                progress
                id
              }
            }
          }
        }
      }
    }
    userCourseSettingsCount(course_id: $course_id, search: $search)
  }
`

interface Props {
  courseID: string
  cursor?: string
}

function PaginatedPointsList(props: Props) {
  const { courseID } = props
  const [searchString, setSearchString] = useState("")
  const search = useDebounce(searchString, 800)

  const { data, loading, error, fetchMore } = useQuery<StudentProgressData>(
    StudentProgresses,
    {
      variables: {
        course_id: courseID,
        cursor: null,
        search: search !== "" ? search : undefined,
      },
      fetchPolicy: "cache-first",
    },
  )

  if (error) {
    return <p>ERROR</p>
  }

  if (!data) {
    return null
  }

  return (
    <ErrorBoundary>
      <TextField
        id="searchString"
        label="Search"
        value={searchString}
        autoComplete="off"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchString(e.target.value)
        }
      />
      {loading ? (
        <div>Loading....</div>
      ) : (
        <>
          <div>{data!.userCourseSettingsCount} results</div>
          <PointsList pointsForUser={data!.UserCourseSettingses.edges} />
          <Button
            onClick={() =>
              fetchMore({
                query: StudentProgresses,
                variables: {
                  course_id: courseID,
                  cursor: data!.UserCourseSettingses.pageInfo.endCursor,
                  search: search !== "" ? search : undefined,
                },

                updateQuery: (previousResult, { fetchMoreResult }) => {
                  const previousData = previousResult.UserCourseSettingses.edges
                  const newData = fetchMoreResult!.UserCourseSettingses.edges
                  const newPageInfo = fetchMoreResult!.UserCourseSettingses
                    .pageInfo
                  return {
                    UserCourseSettingses: {
                      pageInfo: {
                        ...newPageInfo,
                        __typename: "PageInfo",
                      },
                      edges: [...previousData, ...newData],
                      __typename: "UserCourseSettingsConnection",
                    },
                    userCourseSettingsCount: fetchMoreResult!
                      .userCourseSettingsCount,
                  }
                },
              })
            }
            disabled={!data.UserCourseSettingses.pageInfo.hasNextPage}
            fullWidth
            style={{ marginTop: "1rem", fontSize: 22 }}
          >
            Load more
          </Button>
        </>
      )}
    </ErrorBoundary>
  )
}

export default PaginatedPointsList
