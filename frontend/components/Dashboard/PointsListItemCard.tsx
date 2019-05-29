import React from "react"
import { Typography, Grid, Card, CardContent } from "@material-ui/core"
import PointsItemChart from "./PointsItemChart"
import PointsItemTable from "./PointsItemTable"

function PointsListItemCard() {
  return (
    <Grid item xs={12} sm={12} lg={12}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="p">
            Milla Makkonen
          </Typography>
          <Typography variant="body1" component="p">
            test.mail@test.com
          </Typography>
          <Typography variant="body1" component="p">
            12345678
          </Typography>
          <PointsItemChart />
          <PointsItemTable />
        </CardContent>
      </Card>
    </Grid>
  )
}

export default PointsListItemCard
