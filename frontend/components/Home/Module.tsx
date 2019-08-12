import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
// import Link from "@material-ui/core/Link"
import styled from "styled-components"
import ModuleBanner from "./ModuleBanner"
import CourseCard from "./CourseCard"
import ModuleSmallCourseCard from "./ModuleSmallCourseCard"
import NextI18Next from "../../i18n"
import Container from "../Container"
import { ObjectifiedModule } from "../../static/types/moduleTypes"

const IntroText = styled(Typography)`
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
/* 
const ModuleHomeLink = styled(Link)`
  color: #00a68d;
  font-size: 22px;
  margin: auto;
  @media (min-width: 425px) {
    font-size: 28px;
  }
  margin-bottom: 1em;
  padding-bottom: 1em;
` */

function Module({ module }: { module: ObjectifiedModule }) {
  const { t } = NextI18Next.useTranslation("home")
  const startCourses = (module.courses || []).filter(
    c => !c.hidden && c.study_module_start_point,
  )
  const otherCourses = (module.courses || []).filter(
    c => !c.hidden && !c.study_module_start_point,
  )

  return (
    <section style={{ marginBottom: "3em" }}>
      <ModuleBanner module={module} />
      <Container>
        <IntroText variant="subtitle1">{module.description}</IntroText>

        <SubHeader align="center" variant="h3">
          {t("modulesSubtitleStart")}
        </SubHeader>

        <Grid container spacing={3}>
          {startCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Grid>

        {otherCourses.length > 0 ? (
          <>
            <SubHeader align="center" variant="h3">
              {t("modulesSubtitleContinue")}
            </SubHeader>

            <Grid container spacing={3}>
              {otherCourses.map(c => (
                <ModuleSmallCourseCard key={module.id} course={c} />
              ))}
            </Grid>
          </>
        ) : null}

        {/*
        <div
          style={{
            textAlign: "center",
            marginTop: "3em",
          }}
        >
          <NextI18Next.Link href={`/study-modules/${module.slug}`}>
            <ModuleHomeLink underline="always" style={{ cursor: "pointer" }}>
              {t("modulesLinkToHome")}
            </ModuleHomeLink>
          </NextI18Next.Link>
        </div>
        */}
      </Container>
    </section>
  )
}

export default Module
