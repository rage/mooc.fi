import React from "react"
import Container from "/components/Container"
import CourseLanguageContext from "/contexes/CourseLanguageContext"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import PaginatedPointsList from "/components/Dashboard/PaginatedPointsList"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import PointsExportButton from "/components/Dashboard/PointsExportButton"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import { CourseDetailsFromSlug as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlug"
import Spinner from "/components/Spinner"
import ModifiableErrorMesage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlug($slug: String) {
    course(slug: $slug) {
      id
      name
    }
  }
`

const Points = () => {
  const slug = useQueryParameter("id")
  const lng = useQueryParameter("lng")

  const { data, loading, error } = useQuery<CourseDetailsData>(
    CourseDetailsFromSlugQuery,
    {
      variables: { slug: slug },
    },
  )

  if (loading || !data) {
    return <Spinner />
  }

  if (error) {
    return <ModifiableErrorMesage errorMessage={JSON.stringify(error)} />
  }

  if (!data.course) {
    return (
      <>
        <p>Could not find the course. Go back?</p>
      </>
    )
  }
  return (
    <CourseLanguageContext.Provider value={lng}>
      <DashboardTabBar slug={slug} selectedValue={2} />

      <Container>
        <H1NoBackground component="h1" variant="h1" align="center">
          {data.course.name}
        </H1NoBackground>
        <SubtitleNoBackground component="p" variant="subtitle1" align="center">
          Points
        </SubtitleNoBackground>
        <PointsExportButton slug={slug} />
        <PaginatedPointsList courseId={data.course.id} />
      </Container>
    </CourseLanguageContext.Provider>
  )
}

Points.displayName = "Points"

export default withAdmin(Points)
