import { NextSeo } from "next-seo"

import { useQuery } from "@apollo/client"

import Container from "/components/Container"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import PaginatedPointsList from "/components/Dashboard/PaginatedPointsList"
import PointsExportButton from "/components/Dashboard/PointsExportButton"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import Spinner from "/components/Spinner"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import useSubtitle from "/hooks/useSubtitle"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"

import { CourseFromSlugDocument } from "/graphql/generated"

const Points = () => {
  const t = useTranslator(CoursesTranslations)

  const slug = useQueryParameter("slug")

  const { data, loading, error } = useQuery(CourseFromSlugDocument, {
    variables: { slug },
  })

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
    <>
      <NextSeo title={title} />
      <DashboardTabBar slug={slug} selectedValue={2} />

      <Container>
        <H1NoBackground component="h1" variant="h1" align="center">
          {data.course.name}
        </H1NoBackground>
        <SubtitleNoBackground component="p" variant="subtitle1" align="center">
          {t("points")}
        </SubtitleNoBackground>
        <PointsExportButton slug={slug} />
        <PaginatedPointsList courseId={data.course.id} />
      </Container>
    </>
  )
}

export default withAdmin(Points)
