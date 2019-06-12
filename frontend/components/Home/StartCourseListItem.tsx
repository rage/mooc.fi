import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import {
  Grid,
  Typography,
  CardMedia,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerroot: {
      padding: "1em",
    },
    title: {
      fontSize: "1.5em",
    },
    contentroot: {
      padding: "1em",
    },
    imageroot: {
      height: "12em",
      width: "auto",
    },
    grid: {
      marginBottom: "2em",
    },
    card: {
      width: "17em",
      height: "25em",
    },
  }),
)

function StartCourseListItem({ small = false, course }) {
  const classes = useStyles()
  return (
    <Grid item xs={12} lg={small ? 3 : 4} className={classes.grid}>
      <Card className={classes.card}>
        <CardMedia
          component="img"
          alt="Course Logo"
          image={course.photo}
          classes={{ root: classes.imageroot }}
        />
        <CardContent classes={{ root: classes.contentroot }}>
          <Typography variant="body1" component="h4" className={classes.title}>
            {course.name}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            style={{ fontSize: "0.9em" }}
          >
            {course.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default StartCourseListItem
