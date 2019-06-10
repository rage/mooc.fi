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
    item: {
      padding: "0.5em",
    },
  }),
)

function StartCourseListItem() {
  const classes = useStyles()
  return (
    <Grid item xs={12} md={4} lg={4}>
      <Card className={classes.item}>
        <CardHeader title="Tietokoneen toiminta" />
        <CardMedia
          component="img"
          alt="Course Logo"
          image={require("../../static/images/courseimages/tietokoneen-toiminnan-perusteet.jpg")}
        />
        <CardContent>
          <Typography variant="body1" component="p">
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
