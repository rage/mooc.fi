import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Container, Typography, Paper } from "@material-ui/core"
import ModuleCard from "./ModuleCard"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: "hidden",
    },
    title: {
      marginBottom: "2rem",
      padding: "0 1.85rem",
      fontSize: "4rem",
      [theme.breakpoints.down("sm")]: {
        fontSize: "3rem",
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: "2rem",
      },
    },
    subtitle: {
      lineHeight: "1.46429em",
      fontSize: 18,
      fontWeight: 400,
      overflowWrap: "break-word",
      marginBottom: "3rem",
    },
  }),
)

function Modules() {
  const classes = useStyles()
  return (
    <section className={classes.root}>
      <Container>
        <Typography
          component="h2"
          variant="h2"
          align="center"
          className={classes.title}
        >
          Opintokokonaisuudet
        </Typography>
        <Typography
          component="p"
          variant="subtitle1"
          className={classes.subtitle}
        >
          Nämä kurssit ovat aloittelijaystävällisiä, eivätkä vaadi
          ohjelmointiosaamista. Ne ovat hyvä tapa alkaa oppimaan
          tietojenkäsittelytiedettä.
        </Typography>
      </Container>
      <ModuleCard />
      <ModuleCard />
    </section>
  )
}

export default Modules
