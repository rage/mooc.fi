import React from "react"
import { Grid, Typography, Link } from "@material-ui/core"
import styled from "styled-components"
import ModuleBanner from "./ModuleBanner"
import CourseCard from "./CourseCard"
import ModuleSmallCourseCard from "./ModuleSmallCourseCard"

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

const IntroText = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  font-size: 18px;
  width: 90%;
  margin-bottom: 1em;
  padding-bottom: 1em;
  margin-left: 1rem;
  @media (min-width: 425px) {
    font-size: 22px;
    width: 70%;
  }
  @media (min-width: 1000px) {
    font-size: 32px;
    width: 60%;
  }
`

const SubHeader = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  margin-bottom: 1em;
  padding-bottom: 1em;
  margin-left: 1rem;
  font-size: 24px;
  @media (min-width: 425px) {
    font-size: 32px;
  }
  @media (min-width: 1000px) {
    font-size: 48px;
  }
`

const ModuleHomeLink = styled(Link)`
  font-family: "Open Sans Condensed Light", sans-serif;
  color: #00a68d;
  font-size: 16px;
  margin-left: 2em;
  margin-bottom: 1em;
  padding-bottom: 1em;
`

function Modules() {
  return (
    <section style={{ marginBottom: "2em" }}>
      <ModuleBanner />
      <IntroText>
        inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni
      </IntroText>
      <SubHeader align="center">Aloita näistä</SubHeader>
      <Grid container spacing={3} style={{ margin: "0.5rem" }}>
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </Grid>
      <SubHeader align="center">Jatka sitten näihin</SubHeader>
      <Grid container spacing={3}>
        <ModuleSmallCourseCard />
        <ModuleSmallCourseCard />
        <ModuleSmallCourseCard />
      </Grid>
      <ModuleHomeLink underline="always">
        Opinto-kokonaisuuden kotisivulle
      </ModuleHomeLink>
    </section>
  )
}

export default Modules
