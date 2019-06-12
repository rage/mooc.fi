import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, ButtonBase, Typography, Link } from "@material-ui/core"
import { typography } from "material-ui/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      position: "relative",
      height: 200,
      width: "100%",
      boxShadow: "5px 5px 3px lightgrey ",
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
    },
    imageButton: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: "left",
    },
    title: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      fontSize: 24,
      marginBottom: "0.5rem",
    },
    bodyText: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      fontSize: 18,
      marginBottom: "1rem",
    },
    link: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      color: "#00A68D",
      fontSize: 18,
    },
  }),
)

function NaviCard({ item }) {
  //const backgroundImage = require(item.img)
  const classes = useStyles()
  return (
    <Grid item xs={12} lg={4}>
      <ButtonBase focusRipple className={classes.image}>
        <span
          className={classes.imageSrc}
          style={{ backgroundImage: `url(${item.img})` }}
        />
        <span className={classes.imageBackdrop} />
        <span className={classes.imageButton}>
          <Typography className={classes.title}>{item.title}</Typography>
          <Typography className={classes.bodyText} paragraph>
            {item.text}
          </Typography>
          <Link className={classes.link} underline="always">
            <Typography>{item.linkText}</Typography>
          </Link>
        </span>
      </ButtonBase>
    </Grid>
  )
}

export default NaviCard
