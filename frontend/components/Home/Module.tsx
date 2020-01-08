import React, { useMemo } from "react"
import { Grid } from "@material-ui/core"
import styled from "styled-components"
import ModuleSmallCourseCard from "./ModuleSmallCourseCard"
import Skeleton from "@material-ui/lab/Skeleton"
import { mime } from "/util/imageUtils"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"
import { orderBy } from "lodash"
import { CourseStatus } from "/static/types/generated/globalTypes"
import { H2Background, SubtitleNoBackground } from "/components/Text/headers"
import { BackgroundImage } from "/components/Images/GraphicBackground"

interface RootProps {
  backgroundColor: string
}

const Root = styled.div<RootProps>`
  margin-top: 1em;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  margin-bottom: 5em;
  padding-bottom: 4em;
  position: relative;
  ${props =>
    `background-image: linear-gradient(to left, rgba(255,0,0,0) ,${props.backgroundColor} 60%);`}
`

const ContentContainer = styled.div`
  position: relative;
  margin: 1rem;
`
const ModuleHeader = styled(H2Background)`
  font-size: 88px;
  line-height: 128px;
  margin-bottom: 4rem;
`

const ModuleDescription = styled(SubtitleNoBackground)`
  color: white;
`
interface ModuleProps {
  module?: AllModules_study_modules_with_courses
  hueRotateAngle: number
  brightness: number
  backgroundColor: string
}

function Module(props: ModuleProps) {
  const { module, hueRotateAngle, brightness, backgroundColor } = props

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
      id={module ? module.slug : "module-skeleton"}
      style={{ marginBottom: "3em" }}
    >
      <Root backgroundColor={backgroundColor}>
        <picture style={{ zIndex: -1 }}>
          <source srcSet={`${imageUrl}?webp`} type="image/webp" />
          <source srcSet={imageUrl} type={mime(imageUrl)} />
          <BackgroundImage
            src={imageUrl}
            aria-hidden
            hueRotateAngle={hueRotateAngle}
            brightness={brightness}
          />
        </picture>
        <ContentContainer style={{ width: "40%" }}>
          <ModuleHeader
            component="h2"
            variant="h2"
            align="left"
            fontcolor="white"
            titlebackground={backgroundColor}
          >
            {module ? module.name : <Skeleton variant="text" />}
          </ModuleHeader>
          {module ? (
            <ModuleDescription variant="subtitle1">
              {module.description}
            </ModuleDescription>
          ) : (
            <Skeleton />
          )}
        </ContentContainer>
        <ContentContainer style={{ width: "60%" }}>
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
        </ContentContainer>
      </Root>
    </section>
  )
}

export default Module
