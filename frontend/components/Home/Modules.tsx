import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Container, Typography, Paper } from "@material-ui/core"
import ModuleCard from "./ModuleCard"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 8,
      marginBottom: 4,
    },
    title: {
      marginTop: "1.5em",
      marginBottom: "1rem",
      textTransform: "uppercase",
      padding: "0 1.85rem",
    },
    subtitle: {
      lineHeight: "1.46429em",
      fontSize: 18,
      fontWeight: 400,
    },
  }),
)

function Modules() {
  const classes = useStyles()
  return (
    <Container component="section" className={classes.root}>
      <Typography
        component="h2"
        variant="h3"
        align="center"
        className={classes.title}
      >
        Kaikki Opintokokonaisuudet
      </Typography>
      <Typography
        component="p"
        variant="subtitle1"
        className={classes.subtitle}
      >
        Tarjoamme useita opintokokonaisuuksia, jotka muodostavat yhteinäisiä
        kurssisarjoja neljältä eri tietojenkäsittelytieteen osa-alueelta:
        Koodaus, tietoturva, pilvipohjaiset websovellukset sekä tekoäly ja
        datatiede. Opintokokonaisuuden suorittaminen antaa hyvän pohjan sen osa
        alueen taidoille.
      </Typography>
      <Grid container spacing={3}>
        <ModuleCard />
        <ModuleCard />
      </Grid>
    </Container>
  )
}

export default Modules
