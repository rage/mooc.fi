import Grid from "@mui/material/Grid"

import PointsListItemCard from "/components/Dashboard/PointsListItemCard"

import { CurrentUserProgressesQuery } from "/graphql/generated"

interface GridProps {
  data: CurrentUserProgressesQuery
  showOnlyTen?: boolean
}

function PointsListGrid(props: GridProps) {
  const { data, showOnlyTen } = props

  const progressesToShow = showOnlyTen
    ? (data.currentUser?.progresses ?? []).slice(0, 10)
    : data.currentUser?.progresses ?? []

  return (
    <Grid container spacing={3}>
      {progressesToShow.map((progress, index) => (
        <PointsListItemCard
          key={`${progress.course?.id}-${index}`}
          course={progress.course}
          userCourseProgress={progress.user_course_progress}
          userCourseServiceProgresses={progress.user_course_service_progresses}
        />
      ))}
    </Grid>
  )
}

export default PointsListGrid
