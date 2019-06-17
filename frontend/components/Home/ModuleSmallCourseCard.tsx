import React from "react"
import { Grid, Typography, ButtonBase } from "@material-ui/core"
import styled from "styled-components"

const CourseTitle = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  margin-bottom: 0.5rem;
  font-size: 22px;
  @media (min-width: 425px) {
    font-size: 32px;
  }
`
const CourseText = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  margin-bottom: 1rem;
  font-size: 16px;
  @media (min-width: 425px) {
    font-size: 18px;
  }
`

const Button = styled(ButtonBase)`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
function ModuleSmallCourseCard({ course }) {
  return (
    <Grid item xs={12} md={4} lg={4}>
      <Button focusRipple href={`${course.link}`}>
        <CourseTitle align="left">{course.name}</CourseTitle>
        <CourseText paragraph>{course.description}</CourseText>
      </Button>
    </Grid>
  )
}

export default ModuleSmallCourseCard
