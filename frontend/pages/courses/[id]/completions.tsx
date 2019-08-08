import React from "react"
import { isSignedIn, isAdmin } from "../../../lib/authentication"
import redirect from "../../../lib/redirect"
import { NextPageContext as NextContext } from "next"
import AdminError from "../../../components/Dashboard/AdminError"
import CompletionsList from "../../../components/Dashboard/CompletionsList"
import { WideContainer } from "../../../components/Container"
import CourseLanguageContext from "../../../contexes/CourseLanguageContext"
import LanguageSelector from "../../../components/Dashboard/LanguageSelector"
import Typography from "@material-ui/core/Typography"
import { withRouter, SingletonRouter } from "next/router"
import DashboardBreadCrumbs from "../../../components/Dashboard/DashboardBreadCrumbs"
import DashboardTabBar from "../../../components/Dashboard/DashboardTabBar"
import { useQuery } from "react-apollo-hooks"
import { gql } from "apollo-boost"

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetails($slug: String) {
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
const Completions = (props: CompletionsProps) => {
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

  const handleLanguageChange = (event: React.ChangeEvent<unknown>) => {
    router.push(
      `/courses/${slug}/completions?lng=${
        (event.target as HTMLInputElement).value
      }`,
    )
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
  return (
    <CourseLanguageContext.Provider value={lng}>
      <DashboardBreadCrumbs />
      <DashboardTabBar slug={slug} selectedValue={1} />

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
          Completions
        </Typography>
        <LanguageSelector
          handleLanguageChange={handleLanguageChange}
          languageValue={lng}
        />
        <CompletionsList />
      </WideContainer>
    </CourseLanguageContext.Provider>
  )
}

Completions.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(Completions)
