import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ModuleNaviCard from "./ModuleNaviCard"
import NextI18Next from "../../i18n"
import styled from "styled-components"
import Container from "../Container"

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

function ModuleNavi({ modules }) {
  console.log("Modulenavi", modules)
  const classes = useStyles()
  return (
    <section style={{ marginBottom: "5em" }}>
      <Typography component="h2" className={classes.title} align="center">
        <NextI18Next.Trans i18nKey="modulesTitle" />
      </Typography>
      <Container>
        <Grid container spacing={5}>
          {modules.map(module => (
            <ModuleNaviCard key={module.title} module={module} />
          ))}
        </Grid>
      </Container>
    </section>
  )
}

export default ModuleNavi
