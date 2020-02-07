import React, { useState, useEffect } from "react"
import { gql } from "apollo-boost"
import ErrorBoundary from "../ErrorBoundary"
import { useLazyQuery } from "@apollo/react-hooks"

import PointsList from "./DashboardPointsList"

import Button from "@material-ui/core/Button"
import useDebounce from "/util/useDebounce"

import { TextField, Grid, Slider, MenuItem } from "@material-ui/core"
import Skeleton from "@material-ui/lab/Skeleton"

import { range } from "lodash"
import {
  UserCourseSettingses as StudentProgressData,
  UserCourseSettingses_UserCourseSettingses_edges,
  UserCourseSettingses_UserCourseSettingses_pageInfo,
} from "/static/types/generated/UserCourseSettingses"
import { UserOverView_currentUser_organization_memberships_organization } from "/static/types/generated/UserOverView"

export const StudentProgresses = gql`
  query UserCourseSettingses(
    $course_id: ID
    $cursor: ID
    $search: String
    $course_string: String
    $organization_ids: [ID!]
  ) {
    UserCourseSettingses(
      course_id: $course_id
      organization_ids: $organization_ids
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
            real_student_number
            progress(course_id: $course_string) {
              course {
                name
                id
              }
              user_course_progress {
                progress
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
            organization_memberships {
              id
              organization {
                id
                slug
                organization_translations {
                  id
                  language
                  name
                }
              }
              role
            }
          }
        }
      }
      count(
        search: $search
        course_id: $course_id
        organization_ids: $organization_ids
      )
    }
  }
`

interface Props {
  courseId: string
  organizations: UserOverView_currentUser_organization_memberships_organization[]
  cursor?: string
}

function PaginatedPointsList(props: Props) {
  const { courseId, organizations } = props

  const organizationValues = organizations?.map(o => ({
    value: o.id,
    label: o.organization_translations?.[0]?.name ?? o.slug,
  }))

  const [searchString, setSearchString] = useState("")
  const [cutterValue, setCutterValue] = useState(0)
  const [search, setSearch] = useDebounce(searchString, 1000)
  const [organizationIds, setOrganizationIds] = useState<string[]>([])

  // use lazy query to prevent running query on each render
  const [getData, { data, loading, error, fetchMore }] = useLazyQuery<
    StudentProgressData
  >(StudentProgresses, {
    fetchPolicy: "cache-first",
  })

  useEffect(() => {
    getData({
      variables: {
        course_id: courseId,
        cursor: null,
        search,
        course_string: courseId,
        organization_ids: organizationIds || [],
      },
    })
  }, [search, organizationIds])

  if (error) {
    return <p>ERROR: {JSON.stringify(error)}</p>
  }

  // FIXME: the gap should depend on screen width
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
            onKeyDown={e => e.key === "Enter" && setSearch()}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="organization"
            label="Organizations"
            select
            variant="outlined"
            value={organizationIds}
            onChange={(event: React.ChangeEvent<any>) =>
              setOrganizationIds(event.target.value)
            }
            SelectProps={{
              multiple: true,
            }}
          >
            {organizationValues.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={10}>
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
        <>
          {range(5).map((i: number) => (
            <Skeleton
              key={`skeleton-${i}`}
              variant="rect"
              width="100%"
              height={180}
              style={{ marginTop: "0.5rem" }}
            />
          ))}
        </>
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            {data?.UserCourseSettingses.count || 0} results
          </div>
          <PointsList
            pointsForUser={data?.UserCourseSettingses?.edges ?? []}
            cutterValue={cutterValue}
          />
          <Button
            onClick={() =>
              fetchMore({
                query: StudentProgresses,
                variables: {
                  course_id: courseId,
                  cursor: data?.UserCourseSettingses.pageInfo.endCursor,
                  search: search !== "" ? search : undefined,
                  course_string: courseId,
                  organization_ids: organizationIds || [],
                },

                updateQuery: (previousResult, { fetchMoreResult }) => {
                  const previousData = previousResult.UserCourseSettingses.edges
                  const newData: UserCourseSettingses_UserCourseSettingses_edges[] =
                    fetchMoreResult?.UserCourseSettingses?.edges ?? []
                  const newPageInfo = fetchMoreResult
                    ? fetchMoreResult.UserCourseSettingses.pageInfo
                    : ({} as UserCourseSettingses_UserCourseSettingses_pageInfo)
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
            disabled={!data?.UserCourseSettingses.pageInfo.hasNextPage}
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
