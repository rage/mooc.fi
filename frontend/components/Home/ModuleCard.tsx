import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import StartCourseList from "./StartCourseLits"
import { Typography } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: "2rem",
      marginBottom: "3rem",
      backgroundColor: "#224960",
      width: "100%",
      marginLeft: 0,
      marginRight: 0,
      color: "#F1F1E6",
    },
    content: {
      padding: "1rem",
    },
    startcourses: {
      fontSize: 18,
    },
    moreCourses: {
      fontSize: 12,
    },
  }),
)

function ModuleCard() {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Typography component="h3" variant="h3">
          Koodaus
        </Typography>
        <Typography component="p" variant="subtitle1" paragraph>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
          sit amet, consectetur
        </Typography>
        <div className={classes.startcourses}>
          <Typography component="h4" variant="h4" gutterBottom={true}>
            Aloita Näistä
          </Typography>
          <StartCourseList />
        </div>
        <div className={classes.moreCourses}>
          <Typography component="h4" variant="h5" gutterBottom={true}>
            Jatka sitten näihin
          </Typography>
          <StartCourseList />
        </div>
      </div>
    </div>
  )
}

export default ModuleCard

/*<Grid item xs={12} sm={12} lg={12}>
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
    </Grid>*/
