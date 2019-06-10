import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import {
  Grid,
  Typography,
  CardMedia,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerroot: {
      padding: "1em",
    },
    title: {
      fontSize: "1.5em",
    },
    contentroot: {
      padding: "1em",
    },
  }),
)

function StartCourseListItem() {
  const classes = useStyles()
  return (
    <Grid item xs={12} md={4} lg={4}>
      <Card>
        <CardHeader
          title="Tietokoneen toiminta"
          classes={{ root: classes.headerroot, title: classes.title }}
        />
        <CardMedia
          component="img"
          alt="Course Logo"
          image={require("../../static/images/courseimages/tietokoneen-toiminnan-perusteet.jpg")}
        />
        <CardContent classes={{ root: classes.contentroot }}>
          <Typography variant="body1" component="p" style={{ fontSize: "1em" }}>
            Ohjelmointia Javalla perusteista lähtien, sekä mahdollisuus
            opinto-oikeuteen. Täydellinen kurssi ohjelmoinnin alkeiden
            opetteluun. Ei vaadi esitietoja.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default StartCourseListItem
