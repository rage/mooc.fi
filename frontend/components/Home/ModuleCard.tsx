import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import StartCourseList from "./StartCourseLits"
import { Typography, Container } from "@material-ui/core"

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
    title: {
      paddingTop: "0.5em",
    },
    subtitle: {
      marginTop: "1rem",
      marginBottom: "1rem",
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
        <Typography component="p" variant="subtitle1" paragraph>
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
            Aloita Näistä
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
          <StartCourseList />
        </div>
      </Container>
    </div>
  )
}

export default ModuleCard
