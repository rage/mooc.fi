import React, { useMemo, useContext } from "react"
import { Grid, Chip } from "@material-ui/core"
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
import { H2Background, SubtitleBackground } from "/components/Text/headers"
import { BackgroundImage } from "/components/Images/GraphicBackground"

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

  const imageUrl = "/static/images/backgroundPattern.svg"

  return (
    <section
      id={module?.slug ?? "module-skeleton"}
      style={{ marginBottom: "3em" }}
    >
      <Root backgroundColor={backgroundColor}>
        <Block>
          <TitleChip label={t("studyModule")} />
        </Block>
        <Block>
          <H2Background
            component="h2"
            variant="h2"
            align="center"
            fontcolor="black"
            titlebackground="#ffffff"
          >
            {module ? module.name : <Skeleton variant="text" />}
          </H2Background>
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
        <Container>
          <Block style={{ width: "100%", marginBottom: "5rem" }}>
            {module ? (
              <SubtitleBackground variant="subtitle1">
                {module.description}
              </SubtitleBackground>
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
        </Container>
      </Root>
    </section>
  )
}

export default Module
