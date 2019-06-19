import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import Explanation from "./Explanation"

const backgroundImage = require("../../static/images/homeBackground.jpg")

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      position: "relative",
      marginBottom: "2rem",
      minHeight: 500,
      [theme.breakpoints.up("xl")]: {
        minHeight: 750,
      },
    },
    backdrop: {
      position: "absolute",
      left: 0,
      width: "70%",
      [theme.breakpoints.up("md")]: {
        width: "45%",
      },
      top: 0,
      bottom: 0,
      backgroundColor: "white",
      opacity: 0.9,
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
      <img style={{ display: "none" }} src={backgroundImage} alt="" />
      <Explanation />
      <div className={classes.backdrop} />
      <div className={classes.backGround} />
    </section>
  )
}

export default ExplanationHero
