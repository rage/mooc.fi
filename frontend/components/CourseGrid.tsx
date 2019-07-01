import React from "react"
import { Grid } from "@material-ui/core"
import CourseCard from "./CourseCard"
import NewCourseCard from "./NewCourseCard"

function CourseGrid({ courses }) {
  return (
    <section>
      <Grid container spacing={3}>
        {(courses || []).map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
        <NewCourseCard />
      </Grid>
    </section>
  )
}

export default CourseGrid
