import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Paper, Typography, Button } from "@material-ui/core"
import StartCourseList from "./StartCourseLits"
import MoreCoursesList from "./MorecoursesList"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    base: {
      textAlign: "left",
      borderRadius: 4,
      display: "block",
      overflow: "hidden",
      padding: "1rem",
      marginTop: "2em",
    },
    header: {
      marginTop: "1em",
      marginBottom: "1em",
      textTransform: "uppercase",
    },
    subtitle: {
      lineHeight: "1.46429em",
      fontSize: 18,
      fontWeight: 400,
    },
  }),
)

function ModuleCard() {
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={12} lg={12}>
      <Paper className={classes.base}>
        <Typography
          variant="h4"
          className={classes.header}
          component="h3"
          align="center"
        >
          Koodaus
        </Typography>
        <Typography variant="body1" component="p" className={classes.subtitle}>
          Ohjelmointia Javalla perusteista lähtien, Sen jälkeen tarjolla
          kursseja v Ei vaadi esitietoja.
        </Typography>
        <StartCourseList />
        <MoreCoursesList />
        <Button variant="outlined" fullWidth>
          Opintokokonaisuuden kotisivulle
        </Button>
      </Paper>
    </Grid>
  )
}

export default ModuleCard
