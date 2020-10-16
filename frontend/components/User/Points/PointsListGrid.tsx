import { UserPoints as UserPointsData } from "/static/types/generated/UserPoints"
import Grid from "@material-ui/core/Grid"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"

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
      {progressesToShow.map((progress, index) => (
        <PointsListItemCard
          key={`${progress.course?.id}-${index}`}
          pointsAll={progress}
        />
      ))}
    </Grid>
  )
}

export default PointsListGrid
