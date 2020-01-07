import React from "react"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import AdminError from "/components/Dashboard/AdminError"
import CourseDashboard from "/components/Dashboard/CourseDashboard"
import { NextPageContext as NextContext } from "next"
import { WideContainer } from "/components/Container"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import { Card } from "@material-ui/core"

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlugQuery($slug: String) {
    course(slug: $slug) {
      id
      name
      completion_email {
        name
      }
    }
  }
`

interface CourseProps {
  admin: boolean
}
const Course = (props: CourseProps) => {
  const { admin } = props

  const slug = useQueryParameter("id")

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
    <section>
      <DashboardTabBar slug={slug} selectedValue={0} />

      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {data.course?.name}
        </H1NoBackground>
        <SubtitleNoBackground component="p" variant="subtitle1" align="center">
          Home
        </SubtitleNoBackground>
        {data.course?.completion_email != null ? (
          <Card style={{ width: "300px", minHeight: "50px" }}>
            Completion Email: {data.course.completion_email?.name}
          </Card>
        ) : (
          <CreateEmailTemplateDialog
            buttonText="Create completion email"
            course={slug}
          />
        )}
        <CourseDashboard />
      </WideContainer>
    </section>
  )
}

Course.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default Course
