import { ChangeEvent, useEffect, useState } from "react"

import { range } from "lodash"

import { useLazyQuery } from "@apollo/client"
import styled from "@emotion/styled"
import { Button, Grid, Skeleton, Slider, TextField } from "@mui/material"

import PointsList from "./DashboardPointsList"
import ErrorBoundary from "/components/ErrorBoundary"
import notEmpty from "/util/notEmpty"
import useDebounce from "/util/useDebounce"

import { StudentProgressesDocument } from "/static/types/generated"

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
  const [getData, { data, loading, error, fetchMore }] = useLazyQuery(
    StudentProgressesDocument,
    {
      // fetchPolicy: "cache-first",
      ssr: false,
      // notifyOnNetworkStatusChange :true
    },
  )

  useEffect(() => {
    getData({
      variables: {
        course_id: courseId,
        search,
      },
    })
  }, [search])

  if (error) {
    return <p>ERROR: {JSON.stringify(error)}</p>
  }

  // FIXME: the gap should depend on screen width
  const sliderMarks = range(0, 101, 10).map((value) => ({
    value,
    label: value,
  }))

  const users = (data?.userCourseSettings?.edges ?? [])
    .map((e) => e?.node)
    .filter(notEmpty)

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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
            onChange={(e: ChangeEvent<{ value: unknown }>) =>
              setCutterValue(e.target.value as number)
            }
          />
        </Grid>
      </Grid>
      {loading ? (
        <>
          <LoadingPointCardSkeleton variant="rectangular" />
          <LoadingPointCardSkeleton variant="rectangular" />
          <LoadingPointCardSkeleton variant="rectangular" />
        </>
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            {data?.userCourseSettings?.totalCount || 0} results
          </div>
          <PointsList data={users} cutterValue={cutterValue} />
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  course_id: courseId,
                  after: data?.userCourseSettings?.pageInfo?.endCursor,
                  search: search !== "" ? search : undefined,
                },
              })
            }}
            disabled={!data?.userCourseSettings?.pageInfo.hasNextPage}
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
