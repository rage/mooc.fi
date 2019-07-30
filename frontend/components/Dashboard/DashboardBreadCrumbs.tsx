import React from "react"
import { Breadcrumbs, Link, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadcrumb: {
      marginTop: 5,
      marginLeft: 5,

      flex: 1,
    },
    link: {
      display: "flex",
    },
    baseDiv: {
      display: "flex",
      marginTop: "0.7rem",
    },
  }),
)

const DashboardBreadCrumbs = ({
  current_page,
}: {
  current_page: string | string[] | undefined
}) => {
  const classes = useStyles()

  return (
    <div className={classes.baseDiv}>
      <Breadcrumbs
        separator=">"
        aria-label="Breadcrumb"
        className={classes.breadcrumb}
      >
        <Link className={classes.link} href={"/"}>
          Home
        </Link>
        <Link className={classes.link} href={`/courses`} underline="hover">
          Courses
        </Link>
        <Link className={classes.link}>{current_page}</Link>
      </Breadcrumbs>
    </div>
  )
}

export default DashboardBreadCrumbs
