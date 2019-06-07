import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Button, Typography } from "@material-ui/core"
import grey from "@material-ui/core/colors/grey"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginTop: "1em",
      marginBottom: "1rem",
      textTransform: "uppercase",
      padding: "0 1.85rem",
    },
    bodyText: {
      padding: "0 1.85rem",
      fontSize: 16,
      lineHeight: "1.46429em",
      fontWeight: 400,
    },
    item: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 5,
      width: "95%",
    },
    button: {
      padding: "0 1.85rem",
      margin: "1rem",
    },
  }),
)

function MoreCoursesListItem() {
  const classes = useStyles()
  return (
    <Grid item xs={12} md={4}>
      <div className={classes.item}>
        <Typography variant="h6" className={classes.title} component="h3">
          Tietokoneen toiminta
        </Typography>
        <Typography variant="body1" component="p" className={classes.bodyText}>
          Ohjelmointia Javalla perusteista lähtien, sekä mahdollisuus
          opinto-oikeuteen. Täydellinen kurssi ohjelmoinnin alkeiden opetteluun.
          Ei vaadi esitietoja.
        </Typography>
        <Button className={classes.button}>Kurssimateriaaliin</Button>
      </div>
    </Grid>
  )
}

export default MoreCoursesListItem
