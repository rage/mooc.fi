import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Container, Typography, Button } from "@material-ui/core"
import StartCourseListItem from "./StartCourseListItem"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "2em",
      display: "flex",
      overflow: "hidden",
    },
    title: {
      marginBottom: "1rem",
      padding: "0 1.85rem",
    },
    subtitle: {
      lineHeight: "1.46429em",
      fontSize: 18,
      fontWeight: 400,
    },
  }),
)

function CourseHighlights() {
  const classes = useStyles()
  return (
    <section className={classes.root}>
      <Container>
        <Typography
          component="h2"
          variant="h2"
          align="center"
          className={classes.title}
        >
          Aloita näistä
        </Typography>
        <Typography
          component="p"
          variant="subtitle1"
          className={classes.subtitle}
        >
          Nämä kurssit ovat aloittelijaystävällisiä, eivätkä vaadi
          ohjelmointiosaamista. Ne ovat hyvä tapa alkaa oppimaan
          tietojenkäsittelytiedettä.
        </Typography>
        <Grid container spacing={5}>
          <StartCourseListItem />
          <StartCourseListItem />
          <StartCourseListItem />
        </Grid>
      </Container>
    </section>
  )
}

export default CourseHighlights
