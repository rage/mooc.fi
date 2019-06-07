import React from "react"
import { Grid } from "@material-ui/core"
import MoreCoursesListItem from "./MoreCoursesListItem"
import MoreCoursesFirstItem from "./MoreCoursesFirstItem"

function MoreCoursesList() {
  return (
    <section>
      <Grid container spacing={1}>
        <MoreCoursesFirstItem />
        <MoreCoursesListItem />
        <MoreCoursesListItem />
      </Grid>
    </section>
  )
}

export default MoreCoursesList
