import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import {
  Grid,
  Card,
  Typography,
  CardHeader,
  Button,
  CardMedia,
  CardActionArea,
} from "@material-ui/core"
import lightBlue from "@material-ui/core/colors/lightBlue"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 5,
      width: "95%",
    },
    title: {
      marginTop: "1.5em",
      marginBottom: "1rem",
      textTransform: "uppercase",
      padding: "0 1.85rem",
    },
    image: {
      height: 150,
    },
    subtitle: {
      lineHeight: "1.46429em",
      fontSize: 18,
      fontWeight: 400,
    },
    bodyText: {
      padding: "0 1.85rem",
      fontSize: 16,
      lineHeight: "1.46429em",
      fontWeight: 400,
    },
    button: {
      padding: "0 1.85rem",
      margin: "1rem",
    },
  }),
)

function StartCourseListItem() {
  const classes = useStyles()
  return (
    <Grid item xs={12} md={4}>
      <div className={classes.item}>
        <Typography variant="h5" className={classes.title} component="h3">
          Tietokoneen toiminta
        </Typography>
        <img
          alt="dog sitting in front of a computer"
          src={require("../../static/images/courseimages/tietokoneen-toiminnan-perusteet.jpg")}
          className={classes.image}
        />
        <Typography variant="body1" component="p" className={classes.bodyText}>
          Ohjelmointia Javalla perusteista lähtien, sekä mahdollisuus
          opinto-oikeuteen. Täydellinen kurssi ohjelmoinnin alkeiden opetteluun.
          Ei vaadi esitietoja.
        </Typography>
        <Button variant="outlined" className={classes.button} fullWidth>
          Kurssimateriaaliin
        </Button>
      </div>
    </Grid>
  )
}

export default StartCourseListItem
