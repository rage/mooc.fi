import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Button, Typography } from "@material-ui/core"
import grey from "@material-ui/core/colors/grey"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginTop: "0.7rem",
      marginBottom: "0.5rem",
      padding: "0 1.85rem",
    },
    bodyText: {
      fontSize: 16,
      fontWeight: 400,
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    },
    item: {
      display: "flex",
      flexDirection: "column",
      padding: 5,
      width: "95%",
      margin: "0.8rem",
    },
  }),
)

function MoreCoursesFirstItem() {
  const classes = useStyles()
  return (
    <Grid item xs={12} md={4}>
      <div className={classes.item}>
        <Typography variant="h5" className={classes.header} component="h3">
          Jatka sitten näillä
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

export default MoreCoursesFirstItem
