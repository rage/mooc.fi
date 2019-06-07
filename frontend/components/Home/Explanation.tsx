import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Paper, Typography } from "@material-ui/core"
import ExpansionPanel from "./ExpansionPanel"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 600,
      zIndex: 50,
      padding: "2rem",
      margin: "5rem 0",
      marginTop: "5rem",
      marginBottom: "0.1rem",
    },
    paperContent: {
      padding: "0.6rem 0",
    },
  }),
)

function Explanation() {
  const classes = useStyles()
  return (
    <Paper className={classes.paper}>
      <Typography variant="h4" component="h1">
        Laadukkaita Ilmaisia verkkokursseja kaikille
      </Typography>
      <div className={classes.paperContent}>
        <Typography variant="subtitle1" component="p">
          Helsingin yliopiston tietojenkäsittelytieteen osasto tarjoaa avoimia
          laadukkaita ja ilmaisia verkkokursseja kaikille. Aloittelija voi
          lähteä liikkeelle Ohjelmoinnin MOOCista tai tekoälyn perusteisiin
          keskittyvästä Elements of AI -kurssista. Osaamistaan päivittävä voi
          syventyä vaikkapa tietoturvaan tai Fullstack -ohjelmointiin.
        </Typography>
      </div>
      <ExpansionPanel />
    </Paper>
  )
}

export default Explanation
