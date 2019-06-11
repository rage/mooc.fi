import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import StartCourseList from "./StartCourseLits"
import { Typography, Container, Button } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: "2rem",
      marginBottom: "3rem",
      backgroundColor: "#224960",
      width: "100%",
      marginLeft: 0,
      marginRight: 0,
      color: "#FFFFFF",
      padding: "3rem",
    },
    bodyText: {
      paddingBottom: "1rem",
    },
    content: {
      padding: "1rem",
    },
    startcourses: {
      fontSize: 18,
    },
    moreCourses: {
      fontSize: 15,
    },
    title: {
      paddingBottom: "2rem",
    },
    subtitle: {
      marginBottom: "2rem",
    },
    link: {
      margin: "auto",
    },
  }),
)

function ModuleCard() {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Container>
        <Typography component="h3" variant="h3" className={classes.title}>
          Koodaus
        </Typography>
        <Typography
          component="p"
          variant="subtitle1"
          paragraph
          className={classes.bodyText}
        >
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
          sit amet, consectetur
        </Typography>
        <div className={classes.startcourses}>
          <Typography
            component="h4"
            variant="h4"
            gutterBottom={true}
            className={classes.subtitle}
          >
            Aloita näistä
          </Typography>
          <StartCourseList />
        </div>
        <div className={classes.moreCourses}>
          <Typography
            component="h4"
            variant="h5"
            gutterBottom={true}
            className={classes.subtitle}
          >
            Jatka sitten näihin
          </Typography>
          <StartCourseList small extra />
        </div>
        <Button color="inherit" className={classes.link}>
          <Typography>Opintokokonaisuuden kotisivulle</Typography>
        </Button>
      </Container>
    </div>
  )
}

export default ModuleCard
