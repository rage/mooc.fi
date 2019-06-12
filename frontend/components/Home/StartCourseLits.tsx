import React from "react"
import { Grid } from "@material-ui/core"
import StartCourseListItem from "./StartCourseListItem"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {},
  }),
)

function StartCourseList({ small = false, extra = false, courses }) {
  const classes = useStyles()
  return (
    <section className={classes.grid}>
      <Grid container spacing={3}>
        {courses.map(course => (
          <StartCourseListItem small={small} key={course.id} course={course} />
        ))}
      </Grid>
    </section>
  )
}

export default StartCourseList
