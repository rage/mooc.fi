import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import ImageBanner from "./ImageBanner"
import CourseCard from "./CourseCard"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "1em",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    grid: {
      marginLeft: "1rem",
      marginRight: "1rem",
    },
  }),
)

function CourseHighlights({ courses }) {
  const classes = useStyles()
  return (
    <section className={classes.root}>
      <ImageBanner />
      <section className={classes.grid}>
        <Grid container spacing={3}>
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Grid>
      </section>
    </section>
  )
}

export default CourseHighlights
