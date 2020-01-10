import React from "react"
import { Grid } from "@material-ui/core"
import ModuleSmallCourseCard from "../ModuleSmallCourseCard"
import { AllCourses_courses as CourseData } from "/static/types/generated/AllCourses"
import { ContentContainer } from "/components/Home/ModuleDisplay/ModuleDescription"
import styled from "styled-components"

const CoursesListContainer = styled(ContentContainer)`
  margin-top: 2rem;
  margin-left: 2rem;
  padding-top: 1rem;
  padding-left: 1rem;
`
interface ModuleCoursesProps {
  courses: CourseData[]
}

const ModuleCoursesDisplay = (props: ModuleCoursesProps) => {
  const { courses } = props
  return (
    <CoursesListContainer>
      <Grid container spacing={3}>
        {courses.map(course => (
          <ModuleSmallCourseCard
            key={`module-course-${course.id}`}
            course={course}
            showHeader={true}
          />
        ))}
      </Grid>
    </CoursesListContainer>
  )
}

export default ModuleCoursesDisplay
