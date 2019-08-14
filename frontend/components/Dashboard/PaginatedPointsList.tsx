import React, { useState, useEffect } from "react"
import { gql } from "apollo-boost"
import ErrorBoundary from "../ErrorBoundary"
import { useLazyQuery } from "@apollo/react-hooks"
import { UserCourseSettingses as StudentProgressData } from "/static/types/generated/UserCourseSettingses"
import PointsList from "./PointsList"
import Button from "@material-ui/core/Button"
import useDebounce from "/util/useDebounce"
import { TextField, Grid, Slider } from "@material-ui/core"
import { range } from "lodash"

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
                  name
                  id
                }
                progress
                id
              }
            }
          }
        }
      }
      count(search: $search)
    }
  }
`

interface Props {
  courseID: string
  cursor?: string
}

function PaginatedPointsList(props: Props) {
  const { courseID } = props
  const [searchString, setSearchString] = useState("")
  const [cutterValue, setCutterValue] = useState(0)
  const search = useDebounce(searchString, 1000)

  // use lazy query to prevent running query on each render
  const [getData, { data, loading, error, fetchMore }] = useLazyQuery<
    StudentProgressData
  >(StudentProgresses, {
    fetchPolicy: "cache-first",
  })

  useEffect(
    () =>
      getData({
        variables: {
          course_id: courseID,
          cursor: null,
          search: search !== "" ? search : undefined,
        },
      }),
    [search],
  )

  if (error) {
    return <p>ERROR: {JSON.stringify(error)}</p>
  }

  if (!data) {
    return null
  }

  const { UserCourseSettingses } = data

  if (!UserCourseSettingses) {
    return null
  }

  const sliderMarks = range(0, 101, 10).map(value => ({ value, label: value }))

  return (
    <ErrorBoundary>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            id="searchString"
            label="Search"
            value={searchString}
            autoComplete="off"
            variant="outlined"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchString(e.target.value)
            }
          />
        </Grid>
        <Grid item xs={4}>
          <Slider
            value={cutterValue}
            onChangeCommitted={(_, value) => setCutterValue(value as number)}
            marks={sliderMarks}
            min={0}
            max={100}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="cutter"
            label="Cutter"
            value={cutterValue}
            autoComplete="off"
            variant="outlined"
            onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
              setCutterValue(e.target.value as number)
            }
          />
        </Grid>
      </Grid>
      {loading ? (
        <div>Loading....</div>
      ) : (
        <>
          <div>{UserCourseSettingses!.count || 0} results</div>
          <PointsList
            pointsForUser={UserCourseSettingses!.edges}
            cutterValue={cutterValue}
          />
          <Button
            onClick={() =>
              fetchMore({
                query: StudentProgresses,
                variables: {
                  course_id: courseID,
                  cursor: UserCourseSettingses.pageInfo.endCursor,
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
                      count: fetchMoreResult!.UserCourseSettingses.count,
                    },
                  }
                },
              })
            }
            disabled={!UserCourseSettingses.pageInfo.hasNextPage}
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
