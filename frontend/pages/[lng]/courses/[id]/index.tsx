import { useContext } from "react"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import CourseDashboard from "/components/Dashboard/CourseDashboard"
import { WideContainer } from "/components/Container"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import { Card, Typography } from "@material-ui/core"
import LanguageContext from "/contexes/LanguageContext"
import LangLink from "/components/LangLink"
import { CourseDetailsFromSlugQuery as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlugQuery"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import getCoursesTranslator from "/translations/courses"
import styled from "styled-components"

const Title = styled(Typography)<any>`
  margin-bottom: 0.7em;
`

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlugQuery($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      teacher_in_charge_name
      teacher_in_charge_email
      start_date
      completion_email {
        name
        id
      }
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
          {data.course?.name}
        </H1NoBackground>
        <Title
          component="p"
          variant="subtitle2"
          align="center"
          gutterBottom={true}
        >
          {data.course?.id}
        </Title>
        <SubtitleNoBackground component="p" variant="subtitle1" align="center">
          {t("courseHome")}
        </SubtitleNoBackground>
        {data.course?.completion_email != null ? (
          <LangLink
            href="/[lng]/email-templates/[id]"
            as={`/${language}/email-templates/${data.course.completion_email?.id}`}
            prefetch={false}
            passHref
          >
            <Card style={{ width: "300px", minHeight: "50px" }}>
              Completion Email: {data.course.completion_email?.name}
            </Card>
          </LangLink>
        ) : (
          <CreateEmailTemplateDialog
            buttonText="Create completion email"
            course={data.course}
          />
        )}
        <CourseDashboard />
      </WideContainer>
    </section>
  )
}

export default withAdmin(Course)
