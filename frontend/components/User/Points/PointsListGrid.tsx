import React from "react"
import { UserPoints as UserPointsData } from "/static/types/generated/UserPoints"
import Grid from "@material-ui/core/Grid"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"

interface GridProps {
  data: UserPointsData
}
function PointsListGrid(props: GridProps) {
  const { data } = props
  console.log(data)
  return (
    <Grid container spacing={3}>
      {data.currentUser!.progresses.map(progress => (
        <PointsListItemCard pointsAll={progress} />
      ))}
    </Grid>
  )
}

export default PointsListGrid
