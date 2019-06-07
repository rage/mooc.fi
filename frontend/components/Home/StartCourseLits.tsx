import React from "react"
import { Grid } from "@material-ui/core"
import StartCourseListItem from "./StartCourseListItem"
import StartCourseFirstItem from "./StartCourseFirstItem"

function StartCourseList() {
  return (
    <section>
      <Grid container spacing={1}>
        <StartCourseFirstItem />
        <StartCourseListItem />
        <StartCourseListItem />
      </Grid>
    </section>
  )
}

export default StartCourseList
