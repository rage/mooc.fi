import React from "react"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import CourseDashboard from "/components/Dashboard/CourseDashboard"
import { WideContainer } from "/components/Container"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import { CourseDetailsFromSlug as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlug"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import withSignedIn from "/lib/with-signed-in"

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlugQuery($slug: String) {
    course(slug: $slug) {
      id
      name
    }
  }
`

const Course = () => {
  const slug = useQueryParameter("id")

  const { data, loading, error } = useQuery<CourseDetailsData>(
    CourseDetailsFromSlugQuery,
    {
      variables: { slug: slug },
    },
  )

  //TODO add circular progress
  if (loading || !data) {
    return <Spinner />
  }

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  if (!data.course) {
    return (
      <>
        <p>Course not found. Go back?</p>
      </>
    )
  }
  return (
    <section>
      <DashboardTabBar slug={slug} selectedValue={0} />

      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {data.course.name}
        </H1NoBackground>
        <SubtitleNoBackground component="p" variant="subtitle1" align="center">
          Home
        </SubtitleNoBackground>
        <CourseDashboard />
      </WideContainer>
    </section>
  )
}

Course.displayName = "Course"

export default withAdmin(withSignedIn(Course))
