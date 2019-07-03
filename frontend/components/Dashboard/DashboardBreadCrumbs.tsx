import React from "react"
import { Breadcrumbs, Link, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import UserDetailContext from "../../contexes/UserDetailContext"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadcrumb: {
      marginTop: 5,
      marginLeft: 5,
      color: "white",
      flex: 1,
    },
    link: {
      display: "flex",
      color: "white",
    },
    baseDiv: {
      display: "flex",
      backgroundColor: "#4e1259",
      color: "white",
    },
    userInfo: {
      marginTop: 5,
      marginBottom: 5,
      marginRight: "1em",
    },
  }),
)

const DashboardBreadCrumbs = ({ page }) => {
  const classes = useStyles()
  const isAdmin = React.useContext(UserDetailContext)

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
        <Link className={classes.link}>{page}</Link>
      </Breadcrumbs>
      {isAdmin ? (
        <Typography variant="body1" component="p" className={classes.userInfo}>
          Role: Admin
        </Typography>
      ) : (
        ""
      )}
    </div>
  )
}

export default DashboardBreadCrumbs
