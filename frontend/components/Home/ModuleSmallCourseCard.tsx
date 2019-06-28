import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"

const CourseTitle = styled(Typography)`
  margin-bottom: 0.5rem;
  font-size: 22px;
  @media (min-width: 425px) {
    font-size: 32px;
  }
  color: black;
`
const CourseText = styled(Typography)`
  margin-bottom: 1rem;
  font-size: 16px;
  @media (min-width: 425px) {
    font-size: 18px;
  }
  color: black;
`

const Button = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
function ModuleSmallCourseCard({ course }) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <Button>
        <a href={`${course.link}`} style={{ textDecoration: "none" }}>
          <CourseTitle align="left">{course.name}</CourseTitle>
          <CourseText paragraph>{course.description}</CourseText>
        </a>
      </Button>
    </Grid>
  )
}

export default ModuleSmallCourseCard
