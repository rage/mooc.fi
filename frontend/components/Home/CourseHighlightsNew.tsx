import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import CourseCard from "./CourseCard"
import Container from "../Container"
import styled from "styled-components"

const Root = styled.section`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 5em;
`
const BackgroundImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
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

const Title = styled(Typography)`
  margin-top: 2rem;
  margin-left: 2rem;
  margin-bottom: 3rem;
  @media (min-width: 320px) {
    font-size: 48px;
  }
  @media (min-width: 600px) {
    font-size: 62px;
  }
  @media (min-width: 960px) {
    font-size: 86px;
  }
`
const Subtitle = styled(Typography)`
  margin-left: 2rem;
  width: 55%;
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

function CourseHighlightsNew(props: CourseHighlightsProps) {
  const { courses, title, headerImage, subtitle } = props

  return (
    <div style={{ minHeight: 120, zIndex: -1 }}>
      <BackgroundImage src={headerImage} />
      <Container>
        <Title align="center">{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
        <Grid container spacing={3}>
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Grid>
      </Container>
    </div>
  )
}

export default CourseHighlightsNew
