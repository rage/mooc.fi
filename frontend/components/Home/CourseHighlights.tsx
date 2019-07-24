import React from "react"
import Grid from "@material-ui/core/Grid"
import CourseCard from "./CourseCard"
import Container from "../Container"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

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
  z-index: -5;
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
  z-index: -2;
  ${props =>
    `filter: hue-rotate(${props.hueRotateAngle}deg) brightness(${
      props.brightness
    });`}
`

interface TitleProps {
  fontColor: string
  titleBackground: string
}

const Title = styled(Typography)<TitleProps>`
  font-family: "Open Sans Condensed", sans-serif !important;
  margin: 5rem auto 1rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: table;

  ${props =>
    ` background-color: ${props.titleBackground}; color: ${props.fontColor};`}
  @media (min-width: 320px) {
    font-size: 46px;
  }
  @media (min-width: 600px) {
    font-size: 56px;
  }
  @media (min-width: 960px) {
    font-size: 72px;
  }
`
const Subtitle = styled(Typography)`
  font-family: "Open Sans Condensed", sans-serif !important;
  margin: 0rem auto 3rem auto;
  padding: 1rem;
  display: table;
  background-color: white;
  @media (min-width: 320px) {
    font-size: 22px;
  }
  @media (min-width: 600px) {
    font-size: 28px;
  }
  @media (min-width: 960px) {
    font-size: 32px;
  }
`

type FilteredCourse = {
  name: string
  description: string
  id: string
  link: string
  photo: any[]
  promote: boolean
  slug: string
  start_point: boolean
  status: string
}

interface CourseHighlightsProps {
  courses: FilteredCourse[]
  title: string
  headerImage: any
  subtitle?: string
  backgroundColor: string
  hueRotateAngle: number
  brightness: number
  fontColor: string
  titleBackground: string
}

function CourseHighlights(props: CourseHighlightsProps) {
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
  } = props

  return (
    <Root backgroundColor={backgroundColor}>
      <BackgroundImage
        src={headerImage}
        aria-hidden
        hueRotateAngle={hueRotateAngle}
        brightness={brightness}
      />

      <div>
        <Title
          component="h2"
          fontColor={fontColor}
          titleBackground={titleBackground}
        >
          {title}
        </Title>
        {subtitle && <Subtitle component="div">{subtitle}</Subtitle>}
      </div>
      <Container>
        <Grid container spacing={3}>
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Grid>
      </Container>
    </Root>
  )
}

export default CourseHighlights
