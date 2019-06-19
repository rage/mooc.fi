import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import ImageBanner from "./ImageBanner"
import CourseCard from "./CourseCard"
import styled from "styled-components"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "1em",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
  }),
)

const GridContainer = styled.section`
  margin-bottom: 2em;
  margin-left: 1em;
  margin-right: 1em;
  @media (min-width: 420px) {
    margin-left: 1.5em;
    margin-right: 1.5em;
  }
  @media (min-width: 700px) {
    margin-left: 2.5em;
    margin-right: 2.5em;
  }
  @media (min-width: 1000px) {
    margin-left: 3.5em;
    margin-right: 3.5em;
  }
  @media (min-width: 1500px) {
    margin-left: 5.5em;
    margin-right: 5.5em;
  }
`

function CourseHighlights({ courses, title, headerImage, subtitle }) {
  const classes = useStyles()
  console.log(title)
  console.log(subtitle)
  return (
    <section className={classes.root} id="coursesAndModules">
      <ImageBanner title={title} image={headerImage} subtitle={subtitle} />
      <GridContainer>
        <Grid container spacing={3}>
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Grid>
      </GridContainer>
    </section>
  )
}

export default CourseHighlights
