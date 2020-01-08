import React from "react"
import { Grid } from "@material-ui/core"
import ModuleSmallCourseCard from "../ModuleSmallCourseCard"
import { AllCourses_courses as CourseData } from "/static/types/generated/AllCourses"
import { ContentContainer } from "/components/Home/ModuleDisplay/ModuleDescription"

interface ModuleCoursesProps {
  courses: CourseData[]
}

const ModuleCoursesDisplay = (props: ModuleCoursesProps) => {
  const { courses } = props
  return (
    <ContentContainer style={{ width: "60%" }}>
      <Grid container spacing={3}>
        {courses.map(course => (
          <ModuleSmallCourseCard
            key={`module-course-${course.id}`}
            course={course}
            showHeader={true}
          />
        ))}
      </Grid>
    </ContentContainer>
  )
}

export default ModuleCoursesDisplay
