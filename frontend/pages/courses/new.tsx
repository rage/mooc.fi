import React from "react"
import { Typography } from "@material-ui/core"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "../../lib/authentication"
import redirect from "../../lib/redirect"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import AdminError from "../../components/Dashboard/AdminError"
import { WideContainer } from "../../components/Container"
import Editor from "../../components/Dashboard/Editor"
// import CourseEdit from "../../components/Dashboard/Editor/Course"
import { withRouter, SingletonRouter } from "next/router"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginTop: "1em",
    },
  }),
)

interface NewCourseProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
}

const NewCourse = (props: NewCourseProps) => {
  const { admin, router } = props
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
        <Editor type="Course" />
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

export default withRouter(NewCourse)
