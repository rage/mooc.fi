import React from "react"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import { NextPageContext as NextContext } from "next"
import AdminError from "/components/Dashboard/AdminError"
import Container from "/components/Container"
import CourseLanguageContext from "/contexes/CourseLanguageContext"
import Typography from "@material-ui/core/Typography"
import { withRouter, SingletonRouter } from "next/router"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import PaginatedPointsList from "/components/Dashboard/PaginatedPointsList"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import PointsExportButton from "/components/Dashboard/PointsExportButton"
import { HOneNoBackground } from "/components/Text/headers"

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlug($slug: String) {
    course(slug: $slug) {
      id
      name
    }
  }
`

interface CompletionsProps {
  admin: boolean
  router: SingletonRouter
}

const Points = (props: CompletionsProps) => {
  const { admin, router } = props
  if (!admin) {
    return <AdminError />
  }

  let slug: string = ""
  let lng: string = ""
  if (router && router.query) {
    if (typeof router.query.lng === "string") {
      lng = router.query.lng
    }
    if (typeof router.query.id === "string") {
      slug = router.query.id
    }
  }

  const { data, loading, error } = useQuery(CourseDetailsFromSlugQuery, {
    variables: { slug: slug },
  })

  //TODO add circular progress
  if (loading) {
    return null
  }
  //TODO fix error message
  if (error || !data) {
    return <p>Error has occurred</p>
  }

  return (
    <CourseLanguageContext.Provider value={lng}>
      <DashboardTabBar slug={slug} selectedValue={2} />

      <Container>
        <HOneNoBackground component="h1" variant="h1" align="center">
          {data.course.name}
        </HOneNoBackground>
        <Typography
          component="p"
          variant="subtitle1"
          align="center"
          style={{ marginBottom: "2rem" }}
        >
          Points
        </Typography>
        <PointsExportButton slug={slug} />
        <PaginatedPointsList courseID={data.course.id} />
      </Container>
    </CourseLanguageContext.Provider>
  )
}

Points.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default withRouter(Points)
