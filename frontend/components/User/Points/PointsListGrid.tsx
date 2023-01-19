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
    <Grid container spacing={3}>
      {progressesToShow.map((progress) => (
        <PointsListItemCard
          key={`${progress.course?.id}-${progress?.user_course_progress?.id}`}
          course={progress.course}
          userCourseProgress={progress.user_course_progress}
          userCourseServiceProgresses={progress.user_course_service_progresses}
        />
      ))}
    </Grid>
  )
}

export default PointsListGrid
