import React from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core"

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
  }),
)

const CourseDashboard = () => {
  const classes = useStyles()
  return (
    <section>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom={true}
        className={classes.title}
      >
        Dashboard
      </Typography>
      <Card>
        <CardMedia
          component="img"
          image="../static/images/coming-soon.png"
          title="Dashboard coming soon"
          alt="Street sign stating coming soon"
        />
        <CardContent>New course dashboard will be here soon</CardContent>
      </Card>
    </section>
  )
}

export default CourseDashboard
