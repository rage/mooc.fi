import React from "react"
import { Typography } from "@material-ui/core"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "../../../lib/authentication"
import redirect from "../../../lib/redirect"
import AdminError from "../../../components/Dashboard/AdminError"
import { WideContainer } from "../../../components/Container"
import CourseEdit from "../../../components/Dashboard/CourseEdit/CourseEdit"
import { withRouter, SingletonRouter } from "next/router"
import { useQuery } from "react-apollo-hooks"
import { gql } from "apollo-boost"
import DashboardTabBar from "../../../components/Dashboard/DashboardTabBar"
import DashboardBreadCrumbs from "../../../components/Dashboard/DashboardBreadCrumbs"

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
      hidden
      status
      course_translations {
        id
        name
        language
        description
        link
      }
      open_university_registration_links {
        id
        course_code
        language
        link
      }
      study_module {
        id
      }
    }
  }
`

interface EditCourseProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
}

const EditCourse = (props: EditCourseProps) => {
  const { admin, router } = props
  const isNew = router.asPath === "/courses/new"
  let slug: string = ""
  if (router && router.query) {
    if (typeof router.query.id === "string") {
      slug = router.query.id
    }
  }

  const { data, loading, error } = useQuery(CourseQuery, {
    variables: { slug: slug },
  })

  if (!admin) {
    return <AdminError />
  }

  if (loading) {
    return null
  }

  if (!data.course && !isNew) {
    router.push("/courses/new")
  }

  return (
    <section>
      <DashboardBreadCrumbs />
      {data.course ? <DashboardTabBar slug={slug} selectedValue={3} /> : ""}
      <WideContainer>
        {data.course ? (
          <>
            <Typography
              component="h1"
              variant="h1"
              align="center"
              style={{ marginTop: "2rem", marginBottom: "0.5rem" }}
            >
              {data.course.name}
            </Typography>
            <Typography
              component="p"
              variant="subtitle1"
              align="center"
              style={{ marginBottom: "2rem" }}
            >
              Edit course
            </Typography>
          </>
        ) : (
          <Typography
            component="h1"
            variant="h1"
            align="center"
            style={{ marginTop: "2rem", marginBottom: "0.5rem" }}
          >
            Create a new course
          </Typography>
        )}
        <CourseEdit course={data.course} />
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
