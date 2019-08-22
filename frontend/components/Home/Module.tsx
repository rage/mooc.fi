import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import ModuleBanner from "./ModuleBanner"
import CourseCard from "./CourseCard"
import ModuleSmallCourseCard from "./ModuleSmallCourseCard"
import Container from "/components/Container"
import { ObjectifiedModule } from "/static/types/moduleTypes"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { CourseStatus } from "/static/types/globalTypes"
import Skeleton from "@material-ui/lab/Skeleton"

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

function Module({ module }: { module?: ObjectifiedModule }) {
  const lng = useContext(LanguageContext)
  const t = getHomeTranslator(lng.language)

  const startCourses = module
    ? (module!.courses || []).filter(
        c =>
          !c.hidden &&
          c.status !== CourseStatus.Ended &&
          c.study_module_start_point,
      )
    : []

  const otherCourses = module
    ? (module!.courses || []).filter(
        c =>
          !c.hidden &&
          c.status !== CourseStatus.Ended &&
          !c.study_module_start_point,
      )
    : []

  return (
    <section
      id={`module-list-${module ? module.slug : "skeleton"}`}
      style={{ marginBottom: "3em" }}
    >
      <ModuleBanner module={module} />
      <Container>
        {module ? (
          <IntroText variant="subtitle1">{module.description}</IntroText>
        ) : (
          <Skeleton />
        )}
        <SubHeader align="center" variant="h3">
          {t("modulesSubtitleStart")}
        </SubHeader>

        <Grid container spacing={3}>
          {module ? (
            startCourses.map(course => (
              <CourseCard key={`module-course-${course.id}`} course={course} />
            ))
          ) : (
            <>
              <CourseCard key="module-course-skeleton1" />
              <CourseCard key="module-course-skeleton2" />
            </>
          )}
        </Grid>

        {otherCourses.length > 0 ? (
          <>
            <SubHeader align="center" variant="h3">
              {t("modulesSubtitleContinue")}
            </SubHeader>

            <Grid container spacing={3}>
              {otherCourses.map(c => (
                <ModuleSmallCourseCard
                  key={`module-course-${c.id}`}
                  course={c}
                />
              ))}
            </Grid>
          </>
        ) : null}

        {/* FIXME: study module home link - enable when that's done */
        /*
        <div
          style={{
            textAlign: "center",
            marginTop: "3em",
          }}
        >
          <LangLink href={`/study-modules/${module.slug}`}>
            <ModuleHomeLink underline="always" style={{ cursor: "pointer" }}>
              {t("modulesLinkToHome")}
            </ModuleHomeLink>
          </LangLink>
        </div>
        */}
      </Container>
    </section>
  )
}

export default Module
