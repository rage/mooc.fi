import PointsListItemCard from "/components/Dashboard/PointsListItemCard"
import {
  UserPoints as UserPointsData,
  UserPoints_currentUser_progresses,
} from "/static/types/generated/UserPoints"
import notEmpty from "/util/notEmpty"

import Grid from "@mui/material/Grid"

interface GridProps {
  data: UserPointsData
  showOnlyTen?: boolean
}
function PointsListGrid(props: GridProps) {
  const { data, showOnlyTen } = props

  const progressesToShow = showOnlyTen
    ? (data.currentUser?.progresses ?? []).slice(0, 10)
    : data.currentUser?.progresses ?? []

  return (
    <Grid container spacing={3}>
      {progressesToShow.map(
        (progress: UserPoints_currentUser_progresses, index) => (
          <PointsListItemCard
            key={`${progress.course?.id}-${index}`}
            course={progress.course}
            userCourseProgress={progress.user_course_progress}
            userCourseServiceProgresses={progress.user_course_service_progresses?.filter(
              notEmpty,
            )}
          />
        ),
      )}
    </Grid>
  )
}

export default PointsListGrid
