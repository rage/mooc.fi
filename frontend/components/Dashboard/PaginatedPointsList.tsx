import React, { useState, useEffect } from "react"
import { gql } from "@apollo/client"
import ErrorBoundary from "../ErrorBoundary"
import { useLazyQuery } from "@apollo/client"

import PointsList from "./DashboardPointsList"

import Button from "@material-ui/core/Button"
import useDebounce from "/util/useDebounce"

import { TextField, Grid, Slider } from "@material-ui/core"
import Skeleton from "@material-ui/lab/Skeleton"

import { range } from "lodash"
import styled from "styled-components"
import {
  UserCourseSettings as StudentProgressData,
  UserCourseSettings_userCourseSettings_pageInfo,
} from "/static/types/generated/UserCourseSettings"
import notEmpty from "/util/notEmpty"

export const StudentProgresses = gql`
  query UserCourseSettings($course_id: ID!, $skip: Int, $search: String) {
    userCourseSettings(
      course_id: $course_id
      first: 15
      skip: $skip
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
            real_student_number
            progress(course_id: $course_id) {
              course {
                name
                id
              }
              user_course_progress {
                progress
                exercise_progress {
                  total
                  exercises
                }
                user {
                  first_name
                  last_name
                  username
                  email
                  real_student_number
                }
              }
              user_course_service_progresses {
                progress
                service {
                  name
                  id
                }
              }
            }
          }
        }
      }
      count(course_id: $course_id, search: $search)
    }
  }
`

const LoadingPointCardSkeleton = styled(Skeleton)`
  width: 100%;
  height: 300px;
  margin-bottom: 2rem;
  border-radius: 0.25rem;
`

interface Props {
  courseId: string
  cursor?: string
}

function PaginatedPointsList(props: Props) {
  const { courseId } = props
  const [searchString, setSearchString] = useState("")
  const [cutterValue, setCutterValue] = useState(0)
  const [search, setSearch] = useDebounce(searchString, 1000)

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
          course_id: courseId,
          after: null,
          search,
        },
      }),
    [search],
  )

  if (error) {
    return <p>ERROR: {JSON.stringify(error)}</p>
  }

  if (loading) {
    return (
      <>
        <LoadingPointCardSkeleton variant="rect" />
        <LoadingPointCardSkeleton variant="rect" />
        <LoadingPointCardSkeleton variant="rect" />
      </>
    )
  }

  if (!data) {
    return null
  }

  const { userCourseSettings } = data

  if (!userCourseSettings) {
    return null
  }

  // FIXME: the gap should depend on screen width
  const sliderMarks = range(0, 101, 10).map((value) => ({
    value,
    label: value,
  }))

  const edges = (userCourseSettings?.edges ?? []).filter(notEmpty)

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
            onKeyDown={(e) => e.key === "Enter" && setSearch()}
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
        <Skeleton variant="rect" width={120} height={180} />
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            {userCourseSettings.count || 0} results
          </div>
          <PointsList pointsForUser={edges} cutterValue={cutterValue} />
          <Button
            onClick={() =>
              fetchMore({
                query: StudentProgresses,
                variables: {
                  course_id: courseId,
                  skip: userCourseSettings.edges?.length ?? 0,
                  search: search !== "" ? search : undefined,
                },

                updateQuery: (
                  previousResult,
                  {
                    fetchMoreResult,
                  }: { fetchMoreResult?: StudentProgressData },
                ) => {
                  const previousData = (
                    previousResult?.userCourseSettings?.edges ?? []
                  ).filter(notEmpty)
                  const newData = (
                    fetchMoreResult?.userCourseSettings?.edges ?? []
                  ).filter(notEmpty)
                  const newPageInfo: UserCourseSettings_userCourseSettings_pageInfo = fetchMoreResult
                    ?.userCourseSettings?.pageInfo ?? {
                    hasNextPage: false,
                    endCursor: null,
                    __typename: "PageInfo",
                  }

                  return {
                    userCourseSettings: {
                      pageInfo: {
                        ...newPageInfo,
                        __typename: "PageInfo",
                      },
                      edges: [...previousData, ...newData],
                      __typename: "QueryUserCourseSettings_Connection",
                      count: fetchMoreResult!.userCourseSettings?.count ?? null,
                    },
                  }
                },
              })
            }
            disabled={!userCourseSettings.pageInfo.hasNextPage}
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
