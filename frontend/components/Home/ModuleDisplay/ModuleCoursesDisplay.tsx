import React from "react"
import styled from "styled-components"
import { Grid } from "@material-ui/core"
import ModuleSmallCourseCard from "../ModuleSmallCourseCard"
import { AllCourses_courses as CourseData } from "/static/types/generated/AllCourses"

const ContentContainer = styled.div`
  position: relative;
  margin: 1rem;
`

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
