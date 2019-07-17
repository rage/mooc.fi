import React, { useState, useEffect } from "react"
import { Typography, CircularProgress } from "@material-ui/core"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "../lib/authentication"
import redirect from "../lib/redirect"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import AdminError from "../components/Dashboard/AdminError"
import { WideContainer } from "../components/Container"
import CourseEditForm from "../components/Dashboard/CourseEdit"
import { withRouter, SingletonRouter } from "next/router"
import { useQuery, useMutation } from "react-apollo-hooks"
import { gql } from "apollo-boost"

// import { Courses as courseData } from "../courseData.js"

export const CourseQuery = gql`
  query CourseDetails($slug: String) {
    course(slug: $slug) {
      id
      name
      slug
      photo {
        id
        compressed
        compressed_mimetype
        uncompressed
        uncompressed_mimetype
      }
      promote
      start_point
      status
      course_translations {
        id
        name
        language
        description
        link
      }
      study_module {
        id
      }
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

interface EditCourseProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
}

const EditCourse = (props: EditCourseProps) => {
  const { admin, router } = props
  const slug = router.query.course

  const classes = useStyles()

  // use mock data
  /*   const data = { course: Courses.allcourses.find(c => c.slug === slug) }
  const loading = false */

  const { data, loading, error } = useQuery(CourseQuery, {
    variables: { slug: slug },
  })

  if (!admin) {
    return <AdminError />
  }

  if (loading) {
    return null
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
          {data.course ? "Edit course" : "Create a new course"}
        </Typography>
        <CourseEditForm course={data.course} />
      </WideContainer>
    </section>
  )
}

EditCourse.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(EditCourse)
