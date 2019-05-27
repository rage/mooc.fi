import React from "react"
import { Grid } from "@material-ui/core"
import CourseCard from "./CourseCard"

function CourseGrid({ courses }) {

  return (
    <section>
      <Grid container spacing={3}>
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </Grid>
    </section>
  )
}

export default CourseGrid
