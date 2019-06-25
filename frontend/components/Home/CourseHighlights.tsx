import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import ImageBanner from "./ImageBanner"
import CourseCard from "./CourseCard"
import styled from "styled-components"
import Container from "../Container"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "1em",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      marginBottom: "5em",
    },
  }),
)

function CourseHighlights({ courses, title, headerImage, subtitle }) {
  const classes = useStyles()

  return (
    <section className={classes.root} id="coursesAndModules">
      <ImageBanner title={title} image={headerImage} subtitle={subtitle} />
      <Container>
        <Grid container spacing={3}>
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Grid>
      </Container>
    </section>
  )
}

export default CourseHighlights
