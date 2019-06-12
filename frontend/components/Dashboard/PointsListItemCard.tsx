import React from "react"
import { Typography, Grid } from "@material-ui/core"
import PointsItemChart from "./PointsItemChart"
import PointsItemTable from "./PointsItemTable"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userName: {
      color: "#6d1b7b",
      textTransform: "uppercase",
      fontWeight: "bold",
      fontSize: 14,
    },
    userInfo: {
      color: "gray",
      fontSize: 12,
    },
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
  }),
)

function PointsListItemCard() {
  const classes = useStyles()

  return (
    <Grid item xs={12} sm={12} lg={12}>
      <Grid container>
        <Grid item xs={8} sm={6} lg={6}>
          <Typography
            variant="body1"
            component="p"
            className={classes.userName}
          >
            Milla Makkonen
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.userInfo}
          >
            test.mail@test.com
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={classes.userInfo}
          >
            12345678
          </Typography>
          <PointsItemChart />
        </Grid>

        <Grid item xs={4} sm={6} lg={6}>
          <PointsItemTable />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PointsListItemCard
