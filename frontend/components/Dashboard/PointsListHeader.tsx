import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Typography, Grid } from "@material-ui/core"
import PointsListHeaderTable from "./PointsListHeaderTable"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCard: {
      padding: "1em",
      backgroundColor: "white",
    },
    title: {
      textTransform: "uppercase",
      fontSize: 24,
    },
  }),
)
function PointsListHeader() {
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={12} lg={12} className={classes.titleCard}>
      <Grid container>
        <Grid item xs={12} sm={12} lg={12}>
          <div className={classes.titleCard}>
            <Typography variant="h6" component="p" className={classes.title}>
              Elements of Ai
            </Typography>
            <Typography variant="subtitle1" component="p">
              Students: 50 0000
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <PointsListHeaderTable />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PointsListHeader
