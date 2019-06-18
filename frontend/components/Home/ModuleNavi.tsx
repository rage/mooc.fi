import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ModuleNaviCard from "./ModuleNaviCard"
import NextI18Next from "../../i18n"
import styled from "styled-components"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      [theme.breakpoints.up("xs")]: {
        fontSize: 46,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 72,
      },
      fontFamily: "Open Sans Condensed Light, sans-serif",
      marginTop: "2rem",
      marginBottom: "1em",
    },
  }),
)

const GridContainer = styled.section`
  margin-bottom: 5em;
  margin-left: 1em;
  margin-right: 1em;
  @media (min-width: 420px) {
    margin-left: 1.5em;
    margin-right: 1.5em;
  }
  @media (min-width: 700px) {
    margin-left: 2.5em;
    margin-right: 2.5em;
  }
  @media (min-width: 1000px) {
    margin-left: 3.5em;
    margin-right: 3.5em;
  }
`

function ModuleNavi({ modules }) {
  console.log("Modulenavi", modules)
  const classes = useStyles()
  return (
    <section>
      <Typography component="h2" className={classes.title} align="center">
        <NextI18Next.Trans i18nKey="modulesTitle" />
      </Typography>
      <GridContainer>
        <Grid container spacing={5}>
          {modules.map(module => (
            <ModuleNaviCard
              key={module.title}
              module={module}
              img="../../static/images/CyberSecurityModule.jpg"
            />
          ))}
        </Grid>
      </GridContainer>
    </section>
  )
}

export default ModuleNavi
