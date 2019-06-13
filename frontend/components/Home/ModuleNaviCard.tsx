import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, ButtonBase, Typography, Link } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      position: "relative",
      [theme.breakpoints.up("xs")]: {
        height: 250,
      },
      [theme.breakpoints.up("md")]: {
        height: 450,
      },
      width: "100%",
      boxShadow:
        "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)",
      overflow: "hidden",
    },
    imageSrc: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
    },
    imageBackdrop: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: "white",
      opacity: 0.9,
      width: "70%",
    },
    imageButton: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: "left",
      display: "flex",
      flexDirection: "column",
      paddingBottom: "1em",
      paddingTop: "1em",
    },
    title: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      [theme.breakpoints.up("xs")]: {
        fontSize: 24,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 48,
      },
      marginBottom: "0.5rem",
      marginLeft: "1rem",
      maxWidth: "60%",
    },
    bodyText: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      [theme.breakpoints.up("xs")]: {
        fontSize: 16,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 22,
      },
      maxWidth: "60%",
      textAlign: "left",
      margin: 0,
      marginLeft: "1rem",
      flex: 1,
    },
  }),
)
function ModuleNaviCard({ item }) {
  const classes = useStyles()
  console.log(item)
  return (
    <Grid item xs={12} md={6} lg={6}>
      <ButtonBase focusRipple className={classes.image}>
        <span
          className={classes.imageSrc}
          style={{ backgroundImage: `url(${item.img})` }}
        />
        <span className={classes.imageBackdrop} />
        <span className={classes.imageButton}>
          <Typography className={classes.title} align="left">
            {item.title}
          </Typography>
          <Typography className={classes.bodyText} paragraph>
            {item.text}
          </Typography>
        </span>
      </ButtonBase>
    </Grid>
  )
}

export default ModuleNaviCard
