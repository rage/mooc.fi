import * as React from "react"
import { Typography, CircularProgress } from "@material-ui/core"
import { NextContext } from "next"
import { isSignedIn, isAdmin } from "../lib/authentication"
import redirect from "../lib/redirect"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import AdminError from "../components/Dashboard/AdminError"
import { WideContainer } from "../components/Container"
import CourseEditForm from "../components/Dashboard/CourseEditForm"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginTop: "1em",
    }
  }),
)

const NewCourse = ({ admin }) => {
  const classes = useStyles()

  if (!admin) {
    return <AdminError />
  }

  return (
    <section>
      <WideContainer>
      <Typography
          component="h1"
          variant="h2"
          gutterBottom={true}
          align="center"
          className={classes.header}
        >
          Create a new course
        </Typography>
        <CourseEditForm course={null} />
      </WideContainer>
    </section>
  )
}

NewCourse.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default NewCourse