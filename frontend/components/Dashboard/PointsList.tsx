import React from "react"
import { Typography, Grid } from "@material-ui/core"
import PointsListHeader from "./PointsListHeader"
import PointsListItemCard from "./PointsListItemCard"

const PointsList = () => {
  return (
    <section>
      <Grid container spacing={3}>
        <PointsListHeader />
        <PointsListItemCard />
      </Grid>
    </section>
  )
}

export default PointsList
