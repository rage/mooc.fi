import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Typography, Grid, Card, CardContent } from "@material-ui/core"
import PointsListHeaderTable from "./PointsListHeaderTable"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCard: {
      borderLeft: "7px solid #ffc107",
    },
  }),
)
function PointsListHeader() {
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={12} lg={12}>
      <Card className={classes.titleCard}>
        <CardContent>
          <div>
            <Typography variant="h6" component="p">
              Elements of Ai
            </Typography>
            <Typography variant="body1" component="p">
              Students: 50 0000
            </Typography>
            <PointsListHeaderTable />
          </div>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default PointsListHeader
