import React from "react"
import ExpansionPanelItem from "./ExpansionPanelItem"
import MoocIcon from "@material-ui/icons/Book"
import DefaIcon from "@material-ui/icons/LocationCity"
import TeacherIcon from "@material-ui/icons/People"

const finnishExplanations = {
  headlineContent: "Laadukkaita, avoimia ja ilmaisia verkkokursseja kaikille",
  leadContent:
    "Helsingin yliopiston tietojenkäsittelytieteen osasto tarjoaa avoimia laadukkaita ja ilmaisia verkkokursseja kaikille. Aloittelija voi lähteä liikkeelle Ohjelmoinnin MOOCista tai tekoälyn perusteisiin keskittyvästä Elements of AI -kurssista. Osaamistaan päivittävä voi syventyä vaikkapa tietoturvaan tai Fullstack -ohjelmointiin.",
  expansionPanelItems: [
    {
      title: "Kaikille avoimia kursseja",
      shortDescription:
        "Verkko-oppimista parhaillaan. Älä huolehdi kurssimaksuista tai koulumatkoista, vaan opiskele missä sinulle sopii.",
      longDescription:
        "MOOCit eli kaikille avoimet verkkokurssit (Massive Open Online Course) ovat nimensä mukaisesti kaikki kurssit ovat avoimia, ilmaisia ja verkkopohjaisia.",
      icon: MoocIcon,
    },
    {
      title: "Ensimmäisen vuoden opinnot kaikille",
      shortDescription:
        "Digital Education for All -hanke avaa tietojenkäsittelytieteen ensimmäisen vuoden kaikille.",
      longDescription:
        "Helsingin yliopiston johtamassa Digital Education for All -hankeeessa myös mukana Aalto-yliopisto, Jyväskylän yliopisto, Oulun yliopisto ja Turun yliopisto.",
      icon: DefaIcon,
      buttonLink:
        "https://www.helsinki.fi/fi/projektit/digital-education-for-all",
      buttonText: "Lisätietoa DEFA:sta",
    },
    {
      title: "Opeta kursseja omassa luokassasi",
      shortDescription:
        "Opettaja! Haluatko kurssimme luokkaasi omilla pistelistoillasi ja omalla aikataulullasi.",
      longDescription:
        "Kaikkia kurssejamme saa käyttää osana omaa opetustaan. Katso lisää Opettajalle-sivulta!",
      icon: TeacherIcon,
      buttonLink: "/",
      buttonText: "Opettajille-sivu",
    },
  ],
}

function ExpansionPanel() {
  return (
    <div>
      {finnishExplanations.expansionPanelItems.map(explanation => (
        <ExpansionPanelItem key={explanation.title} item={explanation} />
      ))}
    </div>
  )
}
export default ExpansionPanel
