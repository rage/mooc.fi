import React from "react"
import Grid from "@material-ui/core/Grid"
import CourseCard from "./CourseCard"
import Container from "/components/Container"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import { ObjectifiedCourse } from "/static/types/moduleTypes"

import useWhyDidYouUpdate from "/lib/why-did-you-update"

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
    `filter: hue-rotate(${props.hueRotateAngle}deg) brightness(${
      props.brightness
    });`}
`

interface TitleProps {
  fontcolor: string
  titlebackground: string
}

const Title = styled(Typography)<TitleProps>`
  margin: 5rem auto 1rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: table;

  ${props =>
    ` background-color: ${props.titlebackground}; color: ${props.fontcolor};`}
`
const Subtitle = styled(Typography)`
  margin: 0rem auto 3rem auto;
  padding: 1rem;
  display: table;
  background-color: white;
`

interface CourseHighlightsProps {
  courses?: ObjectifiedCourse[]
  title: string
  headerImage: any
  subtitle?: string
  backgroundColor: string
  hueRotateAngle: number
  brightness: number
  fontColor: string
  titleBackground: string
  // loading: boolean
}

const CourseHighlights = (props: CourseHighlightsProps) => {
  useWhyDidYouUpdate(`CourseHighlights/${props.title}`, props)

  const {
    courses,
    title,
    headerImage,
    subtitle,
    backgroundColor,
    hueRotateAngle,
    brightness,
    fontColor,
    titleBackground,
    // loading,
  } = props

  return (
    <Root backgroundColor={backgroundColor}>
      <BackgroundImage
        src={headerImage}
        aria-hidden
        hueRotateAngle={hueRotateAngle}
        brightness={brightness}
      />

      <div style={{ zIndex: 20 }}>
        <Title
          component="h2"
          variant="h2"
          fontcolor={fontColor}
          titlebackground={titleBackground}
        >
          {title}
        </Title>
        {subtitle && (
          <Subtitle component="div" variant="subtitle1">
            {subtitle}
          </Subtitle>
        )}
      </div>
      <Container>
        <Grid container spacing={3}>
          {!(courses || []).length ? (
            <>
              <CourseCard key="skeletoncard1" />
              <CourseCard key="skeletoncard2" />
            </>
          ) : (
            (courses || []).map(course => (
              <CourseCard key={`course-${course.id}`} course={course} />
            ))
          )}
        </Grid>
      </Container>
    </Root>
  )
}

export default CourseHighlights
