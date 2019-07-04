import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import NextI18Next from "../../i18n"
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      position: "relative",
      height: 400,

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
      fontSize: 22,
      marginBottom: "0.5rem",
      marginLeft: "1rem",
      maxWidth: "60%",
    },
    bodyText: {
      fontSize: 16,
      maxWidth: "60%",
      textAlign: "left",
      margin: 0,
      marginLeft: "1rem",
      flex: 1,
      [theme.breakpoints.up("lg")]: {
        maxWidth: "55%",
      },
    },
    link: {
      color: "#00A68D",
      fontSize: 18,
      maxWidth: "60%",
      textAlign: "left",
      marginLeft: "1rem",
    },
  }),
)

function NaviCard({ item }) {
  const classes = useStyles()
  const image = require(`../../static/images/${item.img}`)

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <ButtonBase focusRipple className={classes.image}>
        <span
          className={classes.imageSrc}
          style={{ backgroundImage: `url(${image})` }}
        />
        <span className={classes.imageBackdrop} />
        <span className={classes.imageButton}>
          <Typography className={classes.title} align="left">
            {item.title}
          </Typography>
          <Typography className={classes.bodyText} paragraph>
            {item.text}
          </Typography>
          <Typography align="left">
            <NextI18Next.Link href={item.link}>
              <a
                href={item.link}
                className={classes.link}
                aria-label={item.linkText}
              >
                {item.linkText}
              </a>
            </NextI18Next.Link>
          </Typography>
        </span>
      </ButtonBase>
    </Grid>
  )
}

export default NaviCard
