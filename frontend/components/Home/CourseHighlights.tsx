import React from "react"
import Grid from "@material-ui/core/Grid"
import CourseCard from "./CourseCard"
import Container from "../Container"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

const Root = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 5em;
  position: relative;
`
const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  object-fit: cover;
  z-index: -2;
`
const Title = styled(Typography)`
  font-family: "Open Sans Condensed", sans-serif !important;
  margin-top: 2rem;
  margin-left: 2rem;
  margin-bottom: 1rem;
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
  margin-left: 2rem;
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
const TextBackground = styled.span`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  height: 100%;
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
  subtitle: string
}

function CourseHighlights(props: CourseHighlightsProps) {
  const { courses, title, headerImage, subtitle } = props

  return (
    <Root>
      <BackgroundImage
        srcSet={headerImage.srcSet}
        src={headerImage.src}
        alt=""
      />
      <TextBackground>
        <Title align="center">{title}</Title>
        <Subtitle align="center">{subtitle}</Subtitle>

        <Container>
          <Grid container spacing={3}>
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </Grid>
        </Container>
      </TextBackground>
    </Root>
  )
}

export default CourseHighlights
