import Container from "/components/Container"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import PaginatedPointsList from "/components/Dashboard/PaginatedPointsList"
import PointsExportButton from "/components/Dashboard/PointsExportButton"
import ModifiableErrorMesage from "/components/ModifiableErrorMessage"
import Spinner from "/components/Spinner"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import CourseLanguageContext from "/contexts/CourseLanguageContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import { CourseDetailsFromSlug as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlug"
import CoursesTranslations from "/translations/courses"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"
import { NextSeo } from "next-seo"

import { gql, useQuery } from "@apollo/client"

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlug($slug: String) {
    course(slug: $slug) {
      id
      name
    }
  }
`

const Points = () => {
  const t = useTranslator(CoursesTranslations)

  const slug = useQueryParameter("slug")
  const lng = useQueryParameter("lng")

  const { data, loading, error } = useQuery<CourseDetailsData>(
    CourseDetailsFromSlugQuery,
    {
      variables: { slug: slug },
    },
  )

  useBreadcrumbs([
    {
      translation: "courses",
      href: `/courses`,
    },
    {
      label: data?.course?.name,
      href: `/courses/${slug}`,
    },
    {
      translation: "coursePoints",
      href: `/courses/${slug}/points`,
    },
  ])
  const title = useSubtitle(data?.course?.name)

  if (loading || !data) {
    return <Spinner />
  }

  if (error) {
    return <ModifiableErrorMesage errorMessage={JSON.stringify(error)} />
  }

  if (!data.course) {
    return (
      <>
        <p>{t("courseNotFound")}</p>
      </>
    )
  }
  return (
    <>
      <NextSeo title={title} />
      <CourseLanguageContext.Provider value={lng}>
        <DashboardTabBar slug={slug} selectedValue={2} />

        <Container>
          <H1NoBackground component="h1" variant="h1" align="center">
            {data.course.name}
          </H1NoBackground>
          <SubtitleNoBackground
            component="p"
            variant="subtitle1"
            align="center"
          >
            {t("points")}
          </SubtitleNoBackground>
          <PointsExportButton slug={slug} />
          <PaginatedPointsList courseId={data.course.id} />
        </Container>
      </CourseLanguageContext.Provider>
    </>
  )
}

export default withAdmin(Points)
