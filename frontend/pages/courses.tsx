import * as React from "react"
import { Typography, CircularProgress } from "@material-ui/core"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "../lib/authentication"
import redirect from "../lib/redirect"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { ApolloClient, gql } from "apollo-boost"
import { AllCourses as AllCoursesData } from "../static/types/AllCourses"
import { useQuery } from "react-apollo-hooks"
import CourseGrid from "../components/CourseGrid"
import AdminError from "../components/Dashboard/AdminError"
import { WideContainer } from "../components/Container"

import { Courses as courseData } from "../courseData.js"

export const AllCoursesQuery = gql`
  query AllCourses {
    courses {
      id
      name
      slug
      status
      photo {
        id
        compressed
        uncompressed
      }
    }
    currentUser {
      id
      administrator
    }
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginTop: "1em",
    },
  }),
)

const Courses = (admin: boolean) => {
  const classes = useStyles()
  // use mock data
  /*   const data = { courses: courseData.allcourses.slice(0,3) }
  const error = false
  const loading = false */

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
    return <CircularProgress color="primary" />
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
          All Courses
        </Typography>
        <CourseGrid courses={data.courses} />
      </WideContainer>
    </section>
  )
}

Courses.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default Courses
