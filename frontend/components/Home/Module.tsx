import React, { useMemo, useContext } from "react"
import { Grid, Chip } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import ModuleSmallCourseCard from "./ModuleSmallCourseCard"
import Container from "/components/Container"
import Skeleton from "@material-ui/lab/Skeleton"
import { mime } from "/util/imageUtils"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"
import { orderBy } from "lodash"
import { CourseStatus } from "/static/types/generated/globalTypes"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"

const IntroText = styled(Typography)`
  font-size: 22px;
  width: 100%;
  margin-left: 1rem;
  margin-right: 1rem;
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

interface RootProps {
  backgroundColor: string
}

const Root = styled.div<RootProps>`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 5em;
  padding-bottom: 4em;
  position: relative;
  ${props => `background-color: ${props.backgroundColor};`}
`

interface BackgroundProps {
  hueRotateAngle: number
  brightness: number
}

const BackgroundImage = styled.img<BackgroundProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  ${props =>
    `filter: hue-rotate(${props.hueRotateAngle}deg) brightness(${props.brightness});`}
`

const Title = styled(Typography)`
  font-size: 38px;
  margin: 1rem auto 1rem auto;
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

const TitleChip = styled(Chip)`
  margin: 5rem auto 0.5rem auto;
  background-color: rgba(255, 255, 255, 0.8);
`

const Block = styled.div`
  z-index: 20;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
`

interface ModuleProps {
  module?: AllModules_study_modules_with_courses
  hueRotateAngle: number
  brightness: number
  backgroundColor: string
}

function Module(props: ModuleProps) {
  const { module, hueRotateAngle, brightness, backgroundColor } = props
  const { language } = useContext(LanguageContext)
  const t = getHomeTranslator(language)

  const orderedCourses = module
    ? useMemo(
        () =>
          orderBy(module.courses || [], [
            course => course.study_module_start_point !== true,
            course => course.status === CourseStatus.Upcoming,
          ]),
        [module.courses],
      )
    : []

  /*   const startCourses = module
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
    : [] */

  const imageUrl = "/static/images/backgroundPattern.svg"

  return (
    <section
      id={module ? module.slug : "module-skeleton"}
      style={{ marginBottom: "3em" }}
    >
      <Root backgroundColor={backgroundColor}>
        <Block>
          <TitleChip label={t("studyModule")} />
        </Block>
        <Block>
          <Title component="h2" variant="h2" align="center">
            {module ? module.name : <Skeleton variant="text" />}
          </Title>
        </Block>
        <picture>
          <source srcSet={`${imageUrl}?webp`} type="image/webp" />
          <source srcSet={imageUrl} type={mime(imageUrl)} />
          <BackgroundImage
            src={imageUrl}
            aria-hidden
            hueRotateAngle={hueRotateAngle}
            brightness={brightness}
          />
        </picture>
        {/*       <ModuleBanner module={module} /> */}
        <Container>
          <Block style={{ width: "100%", marginBottom: "5rem" }}>
            {module ? (
              <IntroText variant="subtitle1" style={{ width: "100%" }}>
                {module.description}
              </IntroText>
            ) : (
              <Skeleton />
            )}
          </Block>
          <Block style={{ width: "100%", flexDirection: "column" }}>
            <Grid container spacing={3}>
              {module ? (
                orderedCourses.map(course => (
                  <ModuleSmallCourseCard
                    key={`module-course-${course.id}`}
                    course={course}
                    showHeader={true}
                  />
                ))
              ) : (
                <>
                  <ModuleSmallCourseCard key="module-course-skeleton1" />
                  <ModuleSmallCourseCard key="module-course-skeleton2" />
                </>
              )}
            </Grid>
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
