import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      position: "relative",
      flexDirection: "column",
      marginBottom: "2rem",
      paddingBottom: "2rem",
      minHeight: 450,
    },
    backdrop: {
      position: "absolute",
      left: 0,
      width: "70%",
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

      backgroundPosition: "center",
    },
    title: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      marginTop: "2rem",
      marginLeft: "2rem",
      marginBottom: "1rem",
      [theme.breakpoints.up("xs")]: {
        fontSize: 46,
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: 56,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 72,
      },
    },
    subtitle: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      marginLeft: "2rem",
      [theme.breakpoints.up("xs")]: {
        fontSize: 22,
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: 28,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 32,
      },
      width: "55%",
    },
  }),
)

function ImageBanner({ image, title, subtitle }) {
  const classes = useStyles()
  return (
    <section className={classes.root}>
      <img style={{ display: "none" }} src={image} alt="" />
      <Typography component="h2" className={classes.title}>
        {title}
      </Typography>
      <Typography component="p" className={classes.subtitle}>
        {subtitle}
      </Typography>
      <div
        className={classes.backGround}
        style={{ backgroundImage: `url(${image})` }}
      />
    </section>
  )
}

export default ImageBanner
