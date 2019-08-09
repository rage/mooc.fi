import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import ButtonBase from "@material-ui/core/ButtonBase"
import styled from "styled-components"
import { ObjectifiedModuleCourse } from "../../static/types/moduleTypes"

const CourseTitle = styled(Typography)`
  margin-bottom: 0.5rem;
  // font-size: 22px;
  @media (min-width: 425px) {
    // font-size: 32px;
  }
  color: black;
`
const CourseText = styled(Typography)`
  margin-bottom: 1rem;
  // font-size: 16px;
  @media (min-width: 425px) {
    // font-size: 18px;
  }
  color: black;
`

const Background = styled(ButtonBase)`
  background-color: white;
  position: relative;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  height: 100%;
  width: 350px;
  padding: 1rem 1rem 2rem 1rem;
  @media (max-width: 960px) {
    width: 100%;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    width: 100%;
  }
`

function ModuleSmallCourseCard({
  course,
}: {
  course: ObjectifiedModuleCourse
}) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <Background focusRipple>
        <a
          href={`${course.link}`}
          style={{ textDecoration: "none" }}
          aria-label={`To the course homepage of ${course.name}`}
        >
          <CourseTitle component="h3" align="center" variant="h3">
            {course.name}
          </CourseTitle>
          <CourseText component="p" paragraph variant="body1" align="left">
            {course.description}
          </CourseText>
        </a>
      </Background>
    </Grid>
  )
}

export default ModuleSmallCourseCard
