import React from "react"
import { Grid } from "@material-ui/core"
import CourseCard from "./CourseCard"
import { AllCourses_courses } from "./../static/types/generated/AllCourses"

interface CourseGridProps {
  courses: AllCourses_courses[]
}

function CourseGrid(props: CourseGridProps) {
  const { courses } = props
  return (
    <section>
      <Grid container spacing={3}>
        {(courses || []).map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
        <CourseCard key={"newcourse"} />
      </Grid>
    </section>
  )
}

export default CourseGrid
