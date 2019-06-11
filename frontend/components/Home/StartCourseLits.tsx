import React from "react"
import { Grid } from "@material-ui/core"
import StartCourseListItem from "./StartCourseListItem"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {},
  }),
)

function StartCourseList() {
  const classes = useStyles()
  return (
    <section className={classes.grid}>
      <Grid container spacing={4}>
        <StartCourseListItem />
        <StartCourseListItem />
        <StartCourseListItem />
      </Grid>
    </section>
  )
}

export default StartCourseList
