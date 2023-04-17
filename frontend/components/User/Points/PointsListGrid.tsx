import { useMemo } from "react"

import Grid from "@mui/material/Grid"

import PointsListItemCard from "/components/Dashboard/PointsListItemCard"

import { CurrentUserProgressesQuery } from "/graphql/generated"

interface GridProps {
  data: CurrentUserProgressesQuery
  showOnlyTen?: boolean
}

function PointsListGrid(props: GridProps) {
  const { data, showOnlyTen } = props

  const progressesToShow = useMemo(
    () =>
      showOnlyTen
        ? (data.currentUser?.progresses ?? []).slice(0, 10)
        : data.currentUser?.progresses ?? [],
    [data, showOnlyTen],
  )

  return (
    <Grid container>
      {progressesToShow.map((progress, index) => (
        <PointsListItemCard
          key={
            progress?.user_course_progress?.id ??
            progress?.user_course_service_progresses?.[0]?.id ??
            progress.course?.id ??
            index
          }
          course={progress.course}
          userCourseProgress={progress.user_course_progress}
          userCourseServiceProgresses={progress.user_course_service_progresses}
        />
      ))}
    </Grid>
  )
}

export default PointsListGrid
