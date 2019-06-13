import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Button, Typography } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "70%",
      zIndex: 50,
      marginLeft: "1em",
      marginBottom: "1rem",
      overflow: "hidden",
    },
    title: {
      [theme.breakpoints.down("xs")]: {
        fontSize: 72,
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: 144,
      },
      fontFamily: "Open Sans Condensed Light, sans-serif",
      paddingTop: "2rem",
      paddingBottom: "2rem",
    },
    subtitle: {
      [theme.breakpoints.up("xs")]: {
        fontSize: 18,
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: 22,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 32,
      },
      fontFamily: "Open Sans Condensed Light, sans-serif",
      paddingRight: "1rem",
      paddingBottom: "2rem",
    },
    button: {
      margin: "auto",
      backgroundColor: "#00A68D",
      color: "white",
      fontSize: 24,
      fontFamily: "Open Sans Condensed Light, sans-serif",
      marginLeft: "20%",
    },
  }),
)

function Explanation() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography variant="h1" component="h1" className={classes.title}>
        MOOC.fi
      </Typography>
      <div className={classes.subtitleContainer}>
        <Typography
          variant="subtitle1"
          component="p"
          className={classes.subtitle}
        >
          Helsingin yliopiston tietojenkäsittelytieteen osasto tarjoaa avoimia
          laadukkaita ja ilmaisia verkkokursseja kaikille. Aloittelija voi
          lähteä liikkeelle Ohjelmoinnin MOOCista tai tekoälyn perusteisiin
          keskittyvästä Elements of AI -kurssista. Osaamistaan päivittävä voi
          syventyä vaikkapa tietoturvaan tai Fullstack -ohjelmointiin.
        </Typography>
        <Button size="large" variant="contained" className={classes.button}>
          Kurssimme
        </Button>
      </div>
    </div>
  )
}

export default Explanation
