import React from "react"
import { Paper } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: "0.5em",
      height: 500,
      width: "70%",
      display: "flex",
      align: "right",
    },
  }),
)

function CourseDashboard() {
  const classes = useStyles()
  return <Paper className={classes.paper} />
}

export default CourseDashboard
