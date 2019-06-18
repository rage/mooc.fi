import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, ButtonBase, Typography } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      position: "relative",
      width: "100%",
      boxShadow:
        "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)",
      [theme.breakpoints.up("xs")]: {
        height: 215,
      },
      [theme.breakpoints.up("md")]: {
        height: 400,
      },
      maxWidth: 400,
    },
    imageSrc: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundPosition: "center 40%",

      [theme.breakpoints.up("xs")]: {
        width: "45%",
        left: 0,
        top: 0,
        bottom: 0,
      },
      [theme.breakpoints.up("md")]: {
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        height: 200,
      },
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
      display: "flex",
      flexDirection: "column",
      paddingBottom: "1em",
      paddingTop: "1em",
      [theme.breakpoints.up("xs")]: {
        width: "55%",
        right: 0,
        top: 0,
        bottom: 0,
      },
      [theme.breakpoints.up("md")]: {
        width: "100%",
        height: 250,
        right: 0,
        left: 0,
        bottom: 0,
        marginTop: 200,
      },
    },
    title: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      marginBottom: "0.5rem",
      marginLeft: "1rem",
      [theme.breakpoints.up("xs")]: {
        fontSize: 22,
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: 28,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 32,
      },
    },
    bodyText: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      textAlign: "left",
      marginLeft: "1rem",
      marginBottom: "1rem",
      [theme.breakpoints.up("xs")]: {
        fontSize: 16,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 18,
      },
    },
  }),
)

function CourseCard({ course }) {
  const classes = useStyles()
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <ButtonBase focusRipple className={classes.image} href={`${course.link}`}>
        <span
          className={classes.imageSrc}
          style={{ backgroundImage: `url(${course.photo})` }}
        />
        <span className={classes.imageBackdrop} />
        <span className={classes.imageButton}>
          <Typography className={classes.title} align="left">
            {course.name}
          </Typography>
          <Typography className={classes.bodyText} paragraph>
            {course.description}
          </Typography>
        </span>
      </ButtonBase>
    </Grid>
  )
}

export default CourseCard
