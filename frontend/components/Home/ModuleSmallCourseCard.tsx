import React from "react"
import { Grid, Typography } from "@material-ui/core"
import styled from "styled-components"

const CourseTitle = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  margin-bottom: 0.5rem;
  margin-left: 1rem;
  font-size: 22px;
  @media (min-width: 425px) {
    font-size: 32px;
  }
`
const CourseText = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  text-align: left;
  margin-left: 1rem;
  margin-bottom: 1rem;
  font-size: 16px;
  @media (min-width: 425px) {
    font-size: 18px;
  }
`
function ModuleSmallCourseCard() {
  return (
    <Grid item xs={12} md={4} lg={4}>
      <CourseTitle align="left">Ohjelmoinnin Mooc</CourseTitle>
      <CourseText paragraph>
        Ohjelmointia Javalla perusteista lähtien sekä mahdollisuus
        opinto-oikeuteen. Ei esitietovaatimuksia.
      </CourseText>
    </Grid>
  )
}

export default ModuleSmallCourseCard
