import React from "react"
import { Grid, Typography, Link } from "@material-ui/core"
import styled from "styled-components"
import ModuleBanner from "./ModuleBanner"
import CourseCard from "./CourseCard"
import ModuleSmallCourseCard from "./ModuleSmallCourseCard"
import NextI18Next from "../../i18n"

const IntroText = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  font-size: 22px;
  width: 90%;
  margin-bottom: 1em;
  padding-bottom: 1em;
  margin-left: 1rem;
  @media (min-width: 425px) {
    font-size: 26px;
    width: 70%;
  }
  @media (min-width: 1000px) {
    font-size: 32px;
    width: 60%;
  }
`

const SubHeader = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  margin-left: 1rem;
  font-size: 32px;
  @media (min-width: 425px) {
    font-size: 32px;
  }
  @media (min-width: 1000px) {
    font-size: 48px;
  }
`

const ModuleHomeLink = styled(Link)`
  font-family: "Open Sans Condensed Light", sans-serif;
  color: #00a68d;
  font-size: 22px;
  margin: auto;
  @media (min-width: 425px) {
    font-size: 28px;
  }
  margin-bottom: 1em;
  padding-bottom: 1em;
`
const GridContainer = styled.section`
  margin-bottom: 5em;
  margin-left: 1em;
  margin-right: 1em;
  @media (min-width: 420px) {
    margin-left: 1.5em;
    margin-right: 1.5em;
  }
  @media (min-width: 700px) {
    margin-left: 2.5em;
    margin-right: 2.5em;
  }
  @media (min-width: 1000px) {
    margin-left: 3.5em;
    margin-right: 3.5em;
  }
`
function Modules({ module }) {
  const startCourses = module.courses.filter(c => c.start_point === true)
  const otherCourses = module.courses.filter(c => c.start_point === false)
  return (
    <section style={{ marginBottom: "3em" }}>
      <ModuleBanner title={module.name} />
      <IntroText>{module.description}</IntroText>
      <SubHeader align="center">
        <NextI18Next.Trans i18nKey="modulesSubtitleStart" />
      </SubHeader>
      <GridContainer>
        <Grid container spacing={3}>
          {startCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Grid>
      </GridContainer>
      <SubHeader align="center">
        <NextI18Next.Trans i18nKey="modulesSubtitleContinue" />
      </SubHeader>
      <GridContainer>
        <Grid container spacing={3}>
          {otherCourses
            ? otherCourses.map(c => (
                <ModuleSmallCourseCard key={module.id} course={c} />
              ))
            : ""}
        </Grid>
      </GridContainer>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <ModuleHomeLink underline="always">
          <NextI18Next.Trans i18nKey="modulesLinkToHome" />
        </ModuleHomeLink>
      </div>
    </section>
  )
}

export default Modules
