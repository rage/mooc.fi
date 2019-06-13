import React from "react"
import { Grid, Container } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import NaviCard from "./NaviCard"

const naviItems = [
  {
    title: "Kaikille avoimia kursseja",
    text:
      "Verkko-oppimista parhaimmillaan. Älä huolehdi kurssimaksuista tai koulumatkoista, vaan opiskele siellä missä sinulle sopii.",
    linkText: "Kurssit ja Opinto-kokonaisuudet",
    img: "../../static/images/AllCourses.jpg",
  },
  {
    title: "Ensimmäisen vuoden opinnot kaikille",
    text:
      "Digital Education for All -hanke avaa tietojenkäsittelytieteen ensimmäisen vuoden kaikille.",
    linkText: "DEFA -hanke",
    img: "../../static/images/DEFA.jpg",
  },
  {
    title: "Opeta kursseja omassa luokassasi.",
    text:
      "Opettaja! Haluatko kurssime luokkaasi omilla pistelistoillasi ja omalla aikataulullasi.",
    linkText: "Opettajien sivut",
    img: "../../static/images/Opettajien.jpg",
  },
  {
    title: "Täydennä ammattitaitoasi.",
    text:
      "Täydennyskoulutusmoduulimme tarjoavat mahdollisuuksia täydentää osaamistasi.",
    linkText: "FMSCI",
    img: "../../static/images/taydennysKoulutus.jpg",
  },
]
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      marginLeft: "1rem",
      marginRight: "1rem",
      marginBottom: "2em",
    },
  }),
)

function NaviCardList() {
  const classes = useStyles()
  return (
    <section className={classes.grid}>
      <Grid container spacing={3}>
        {naviItems.map(item => (
          <NaviCard key={item.title} item={item} />
        ))}
      </Grid>
    </section>
  )
}

export default NaviCardList
