import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Button, Typography, Container } from "@material-ui/core"
import Explanation from "./Explanation"

const backgroundImage = require("../../static/images/homeBackground.jpg")

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      position: "relative",
    },
    backdrop: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: "black",
      opacity: 0.3,
      zIndex: -1,
    },
    backGround: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      zIndex: -2,
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: "center",
    },
  }),
)

function ExplanationHero() {
  const classes = useStyles()
  return (
    <section className={classes.root}>
      <Container>
        <img style={{ display: "none" }} src={backgroundImage} alt="" />
        <Explanation />
        <div className={classes.backdrop} />
        <div className={classes.backGround} />
      </Container>
    </section>
  )
}

export default ExplanationHero
