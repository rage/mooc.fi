import React from "react"
import { UserPoints as UserPointsData } from "/static/types/generated/UserPoints"
import Grid from "@material-ui/core/Grid"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"

interface GridProps {
  data: UserPointsData
  showOnlyTen?: boolean
}
function PointsListGrid(props: GridProps) {
  const { data, showOnlyTen } = props
  let progressesToShow = data.currentUser!.progresses
  if (showOnlyTen) {
    progressesToShow = progressesToShow.slice(0, 10)
  }
  return (
    <Grid container spacing={3}>
      {progressesToShow.map(progress => (
        <PointsListItemCard pointsAll={progress} />
      ))}
    </Grid>
  )
}

export default PointsListGrid
