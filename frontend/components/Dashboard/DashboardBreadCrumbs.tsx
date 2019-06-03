import React from "react"
import { Breadcrumbs, Link } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadcrumb: {
      marginTop: 5,
      marginLeft: 5,
    },
    link: {
      display: "flex",
    },
  }),
)

const DashboardBreadCrumbs = ({ page }) => {
  const classes = useStyles()
  return (
    <Breadcrumbs
      separator=">"
      aria-label="Breadcrumb"
      className={classes.breadcrumb}
    >
      <Link className={classes.link}>Home</Link>
      <Link className={classes.link} href={`/courses`} underline="hover">
        Courses
      </Link>
      <Link className={classes.link}>{page}</Link>
    </Breadcrumbs>
  )
}

export default DashboardBreadCrumbs
