import * as React from "react"
import { Typography } from "@material-ui/core"
import { NextContext } from "next"
import { isSignedIn, isAdmin } from "../lib/authentication"
import redirect from "../lib/redirect"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { ApolloClient, gql } from "apollo-boost"
import { AllCourses as AllCoursesData } from "./__generated__/AllCourses"
import { useQuery } from "react-apollo-hooks"
import CourseGrid from "../components/CourseGrid"
import AdminError from "../components/AdminError"

export const AllCoursesQuery = gql`
  query AllCourses {
    courses {
      id
      name
      slug
    }
    currentUser {
      id
      administrator
    }
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      widht: "auto",
      display: "block",
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1em",
    },
    title: {
      margin: "auto",
      padding: "1em",
    },
  }),
)

const CompletionDashboard = ({ t, admin }) => {
  const classes = useStyles()

  const { loading, error, data } = useQuery<AllCoursesData>(AllCoursesQuery)

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (!admin) {
    return <AdminError />
  }

  if (loading || !data) {
    return <div>Loading</div>
  }

  return (
    <section>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom={true}
        align="center"
        className={classes.title}
      >
        All Courses
      </Typography>
      <CourseGrid courses={data.courses} />
    </section>
  )
}

CompletionDashboard.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  console.log(admin)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default CompletionDashboard
