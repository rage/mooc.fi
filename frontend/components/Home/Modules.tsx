import React from "react"
import { Grid, Typography, Link } from "@material-ui/core"
import styled from "styled-components"
import ModuleBanner from "./ModuleBanner"
import CourseCard from "./CourseCard"
import ModuleSmallCourseCard from "./ModuleSmallCourseCard"
import NextI18Next from "../../i18n"

const IntroText = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  font-size: 18px;
  width: 90%;
  margin-bottom: 1em;
  padding-bottom: 1em;
  margin-left: 1rem;
  @media (min-width: 425px) {
    font-size: 22px;
    width: 70%;
  }
  @media (min-width: 1000px) {
    font-size: 32px;
    width: 60%;
  }
`

const SubHeader = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  margin-left: 1rem;
  font-size: 24px;
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
  font-size: 18px;
  margin: auto;
  @media (min-width: 425px) {
    font-size: 22px;
  }
  margin-bottom: 1em;
  padding-bottom: 1em;
`

function Modules() {
  return (
    <section
      style={{
        marginBottom: "5em",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ModuleBanner />
      <IntroText>
        inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni
      </IntroText>
      <SubHeader align="center">
        <NextI18Next.Trans i18nKey="modulesSubtitleStart" />
      </SubHeader>
      <section
        style={{
          marginLeft: "1rem",
          marginRight: "1rem",
          marginBottom: "5em",
        }}
      >
        <Grid container spacing={3}>
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </Grid>
      </section>
      <SubHeader align="center">
        <NextI18Next.Trans i18nKey="modulesSubtitleContinue" />
      </SubHeader>
      <section
        style={{
          marginLeft: "1rem",
          marginRight: "1rem",
          marginBottom: "3em",
        }}
      >
        <Grid container spacing={3}>
          <ModuleSmallCourseCard />
          <ModuleSmallCourseCard />
          <ModuleSmallCourseCard />
        </Grid>
      </section>
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
