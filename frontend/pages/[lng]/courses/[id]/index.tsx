import React, { useContext } from "react"
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
import LanguageContext from "/contexes/LanguageContext"
import getCoursesTranslator from "/translations/courses"

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlugQuery($slug: String) {
    course(slug: $slug) {
      id
      name
    }
  }
`

const Course = () => {
  const { language } = useContext(LanguageContext)
  const slug = useQueryParameter("id")
  const t = getCoursesTranslator(language)

  const { data, loading, error } = useQuery<CourseDetailsData>(
    CourseDetailsFromSlugQuery,
    {
      variables: { slug },
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
        <p>{t("courseNotFound")}</p>
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
          {t("courseHome")}
        </SubtitleNoBackground>
        <CourseDashboard />
      </WideContainer>
    </section>
  )
}

export default withAdmin(Course)
