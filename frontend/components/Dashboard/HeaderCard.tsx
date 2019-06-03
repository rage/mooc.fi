import React from "react"
import { Grid, Card, CardContent, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleCard: {
      borderLeft: "7px solid #af52bf",
    },
  }),
)

export function HeaderCard({ course }) {
  console.log(course)
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Card className={classes.titleCard}>
        <CardContent>
          <Typography component="p" variant="h6">
            {course.name}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default HeaderCard
