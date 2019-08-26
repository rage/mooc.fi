import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
// import ModuleBanner from "./ModuleBanner"
import CourseCard from "./CourseCard"
import ModuleSmallCourseCard from "./ModuleSmallCourseCard"
import Container from "/components/Container"
import { ObjectifiedModule } from "/static/types/moduleTypes"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { CourseStatus } from "/static/types/globalTypes"
import Skeleton from "@material-ui/lab/Skeleton"
import { mime } from "/util/imageUtils"

const IntroText = styled(Typography)`
  font-size: 22px;
  width: 100%;
  margin-left: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
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
  margin-top: 0.5rem;
  font-size: 32px;
  background-color: rgba(255, 255, 255, 0.8);
  @media (min-width: 425px) {
    font-size: 32px;
  }
  @media (min-width: 1000px) {
    font-size: 48px;
  }
`

const Root = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 5em;
  padding-bottom: 4em;
  position: relative;
`

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Title = styled(Typography)`
  font-size: 38px;
  margin-top: 2rem;
  margin-left: 2rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  width: 60%;
  @media (min-width: 425px) {
    font-size: 52px;
  }
  @media (min-width: 1000px) {
    font-size: 72px;
  }
`

const Block = styled.div`
  z-index: 20;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
`

const BlockBackground = styled.div`
  margin-left: 1rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
`

function Module({ module }: { module?: ObjectifiedModule }) {
  const lng = useContext(LanguageContext)
  const t = getHomeTranslator(lng.language)

  const startCourses = module
    ? (module.courses || []).filter(
        c =>
          !c.hidden &&
          c.status !== CourseStatus.Ended &&
          c.study_module_start_point,
      )
    : []

  const otherCourses = module
    ? (module.courses || []).filter(
        c =>
          !c.hidden &&
          c.status !== CourseStatus.Ended &&
          !c.study_module_start_point,
      )
    : []

  const imageUrl = module
    ? module.image
      ? `../../static/images/${module.image}`
      : `../../static/images/${module.slug}.jpg`
    : ""

  return (
    <section
      id={module ? module.slug : "module-skeleton"}
      style={{ marginBottom: "3em" }}
    >
      <Root>
        <Block>
          <Title component="h2" variant="h2" align="center">
            {module ? module.name : <Skeleton variant="text" />}
          </Title>
        </Block>
        <picture>
          <source srcSet={imageUrl} type={mime(imageUrl)} />
          <source srcSet={`${imageUrl}?webp`} type="image/webp" />

          <BackgroundImage src={imageUrl} aria-hidden />
        </picture>
        {/*       <ModuleBanner module={module} /> */}
        <Container>
          <Block style={{ width: "100%" }}>
            {module ? (
              <IntroText variant="subtitle1" style={{ width: "100%" }}>
                {module.description}
              </IntroText>
            ) : (
              <Skeleton />
            )}
          </Block>
          <Block style={{ width: "100%", flexDirection: "column" }}>
            <BlockBackground style={{ width: "100%" }}>
              <SubHeader align="center" variant="h3">
                {t("modulesSubtitleStart")}
              </SubHeader>

              <Grid container spacing={3}>
                {module ? (
                  startCourses.map(course => (
                    <CourseCard
                      key={`module-course-${course.id}`}
                      course={course}
                    />
                  ))
                ) : (
                  <>
                    <CourseCard key="module-course-skeleton1" />
                    <CourseCard key="module-course-skeleton2" />
                  </>
                )}
              </Grid>
              <div style={{ marginTop: "2rem" }} />
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
            </BlockBackground>
          </Block>
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
      </Root>
    </section>
  )
}

export default Module
