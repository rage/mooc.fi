import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ModuleNaviCard from "./ModuleNaviCard"

const naviItems = [
  {
    title: "Tekoäly ja Datatiede",
    text:
      "t explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni ",
    img: "../../static/images/AiModule.jpg",
  },
  {
    title: "Koodaustekniikat",
    text:
      "t explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni ",
    img: "../../static/images/CodeModule.jpg",
  },
  {
    title: "Pilvipohjaiset Websovellukset",
    text:
      "t explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni ",
    img: "../../static/images/WebModule.jpg",
  },
  {
    title: "Tietoturva",
    text:
      "t explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni ",
    img: "../../static/images/CyberSecurityModule.jpg",
  },
]
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      marginLeft: "1rem",
      marginRight: "1rem",
      marginBottom: "2em",
    },
    title: {
      [theme.breakpoints.up("xs")]: {
        fontSize: 46,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 72,
      },
      fontFamily: "Open Sans Condensed Light, sans-serif",
      marginTop: "2rem",
      marginBottom: "2rem",
    },
  }),
)

function ModuleNavi() {
  const classes = useStyles()
  return (
    <section className={classes.grid}>
      <Typography component="h2" className={classes.title} align="center">
        Opinto-kokonaisuudet
      </Typography>
      <Grid container spacing={5}>
        {naviItems.map(item => (
          <ModuleNaviCard key={item.title} item={item} />
        ))}
      </Grid>
    </section>
  )
}

export default ModuleNavi
