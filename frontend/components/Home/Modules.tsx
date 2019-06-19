import React from "react"
import { Grid, Typography, Link } from "@material-ui/core"
import styled from "styled-components"
import ModuleBanner from "./ModuleBanner"
import CourseCard from "./CourseCard"
import ModuleSmallCourseCard from "./ModuleSmallCourseCard"
import NextI18Next from "../../i18n"
import Container from "../Container"

const IntroText = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  font-size: 22px;
  width: 90%;
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
  margin-top: 3em;
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

function Modules({ module }) {
  const startCourses = module.courses.filter(c => c.start_point === true)
  const otherCourses = module.courses.filter(c => c.start_point === false)
  return (
    <section style={{ marginBottom: "3em" }}>
      <ModuleBanner module={module} />
      <Container>
        <IntroText>{module.description}</IntroText>

        <SubHeader align="center">
          <NextI18Next.Trans i18nKey="modulesSubtitleStart" />
        </SubHeader>

        <Grid container spacing={3}>
          {startCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Grid>

        <SubHeader align="center">
          <NextI18Next.Trans i18nKey="modulesSubtitleContinue" />
        </SubHeader>

        <Grid container spacing={3}>
          {otherCourses
            ? otherCourses.map(c => (
                <ModuleSmallCourseCard key={module.id} course={c} />
              ))
            : ""}
        </Grid>

        <div
          style={{
            textAlign: "center",
            marginTop: "3em",
          }}
        >
          <ModuleHomeLink underline="always">
            <NextI18Next.Trans i18nKey="modulesLinkToHome" />
          </ModuleHomeLink>
        </div>
      </Container>
    </section>
  )
}

export default Modules
