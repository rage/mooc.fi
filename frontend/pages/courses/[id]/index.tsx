import React, { useState } from "react"
import DashboardTabBar from "../../../components/Dashboard/DashboardTabBar"
import LanguageSelector from "../../../components/Dashboard/LanguageSelector"
import DashboardBreadCrumbs from "../../../components/Dashboard/DashboardBreadCrumbs"
import { isSignedIn, isAdmin } from "../../../lib/authentication"
import redirect from "../../../lib/redirect"
import AdminError from "../../../components/Dashboard/AdminError"
import CourseDashboard from "../../../components/Dashboard/CourseDashboard"
import { NextPageContext as NextContext } from "next"
import { WideContainer } from "../../../components/Container"
import { withRouter, SingletonRouter } from "next/router"
import CourseLanguageContext from "../../../contexes/CourseLanguageContext"
import { useQuery } from "react-apollo-hooks"
import { gql } from "apollo-boost"
import Typography from "@material-ui/core/Typography"

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlugQuery($slug: String) {
    course(slug: $slug) {
      id
      name
    }
  }
`

interface CourseProps {
  admin: boolean
  nameSpacesRequired: string[]
  router: SingletonRouter
}
const Course = (props: CourseProps) => {
  const { admin, router } = props

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

  if (!admin) {
    return <AdminError />
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

  const handleLanguageChange = (event: React.ChangeEvent<unknown>) => {
    router.push(
      `/courses/${slug}?lng=${(event.target as HTMLInputElement).value}`,
    )
  }

  return (
    <CourseLanguageContext.Provider value={lng}>
      <section>
        <DashboardBreadCrumbs />
        <DashboardTabBar slug={slug} selectedValue={0} />

        <WideContainer>
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
            Home
          </Typography>
          <LanguageSelector
            handleLanguageChange={handleLanguageChange}
            languageValue={lng}
          />
          <CourseDashboard />
        </WideContainer>
      </section>
    </CourseLanguageContext.Provider>
  )
}

Course.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(Course)

/**/

//
