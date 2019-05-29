import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Typography, Grid } from "@material-ui/core"
import PointsListHeader from "./PointsListHeader"
import PointsListItemCard from "./PointsListItemCard"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCard: {
      borderLeft: "7px solid #ffc107",
    },
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
  }),
)

const PointsList = () => {
  const classes = useStyles()
  return (
    <section>
      <Typography
        component="h1"
        variant="h3"
        align="center"
        gutterBottom={true}
        className={classes.title}
      >
        Points
      </Typography>
      <Grid container spacing={3}>
        <PointsListHeader />
        <PointsListItemCard />
      </Grid>
    </section>
  )
}

export default PointsList
