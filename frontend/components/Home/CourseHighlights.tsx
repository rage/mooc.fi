import React from "react"
import Grid from "@material-ui/core/Grid"
import ImageBanner from "./ImageBanner"
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
      <ImageBanner title={title} image={headerImage} subtitle={subtitle} />
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
