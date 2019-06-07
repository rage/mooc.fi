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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 5,
      width: "95%",
      marginTop: "5rem",
    },
    image: {
      height: 150,
    },
    bodyText: {
      padding: "0 1.85rem",
      fontSize: 16,
      lineHeight: "1.46429em",
      fontWeight: 400,
    },
    title: {
      marginTop: "1.5em",
      marginBottom: "1rem",
      textTransform: "uppercase",
      padding: "0 1.85rem",
    },
  }),
)

function StartCourseFirstItem() {
  const classes = useStyles()
  return (
    <Grid item xs={12} md={4}>
      <div className={classes.item}>
        <Typography variant="h5" className={classes.title} component="h3">
          Aloita Näistä
        </Typography>
        <Typography variant="body1" component="p" className={classes.bodyText}>
          Ohjelmointia Javalla perusteista lähtien, sekä mahdollisuus
          opinto-oikeuteen. Täydellinen kurssi ohjelmoinnin alkeiden opetteluun.
          Ei vaadi esitietoja.
        </Typography>
      </div>
    </Grid>
  )
}

export default StartCourseFirstItem
