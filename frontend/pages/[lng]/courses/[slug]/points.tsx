import Container from "/components/Container"
import CourseLanguageContext from "../../../../contexts/CourseLanguageContext"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import PaginatedPointsList from "/components/Dashboard/PaginatedPointsList"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import PointsExportButton from "/components/Dashboard/PointsExportButton"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import { CourseDetailsFromSlug as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlug"
import Spinner from "/components/Spinner"
import ModifiableErrorMesage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

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
    <CourseLanguageContext.Provider value={lng}>
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
    </CourseLanguageContext.Provider>
  )
}

export default withAdmin(Points)
