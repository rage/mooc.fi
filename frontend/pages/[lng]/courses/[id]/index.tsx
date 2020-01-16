import React from "react"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import CourseDashboard from "/components/Dashboard/CourseDashboard"
import { WideContainer } from "/components/Container"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import CreateEmailTemplateDialog from "/components/CreateEmailTemplateDialog"
import { Card } from "@material-ui/core"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import LangLink from "/components/LangLink"
import { CourseDetailsFromSlugQuery as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlugQuery"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"

export const CourseDetailsFromSlugQuery = gql`
  query CourseDetailsFromSlugQuery($slug: String) {
    course(slug: $slug) {
      id
      name
      completion_email {
        name
        id
      }
    }
  }
`

const Course = () => {
  const slug = useQueryParameter("id")
  const { language } = useContext(LanguageContext)

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
          {data.course?.name}
        </H1NoBackground>
        <SubtitleNoBackground component="p" variant="subtitle1" align="center">
          Home
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
            course={slug}
          />
        )}
        <CourseDashboard />
      </WideContainer>
    </section>
  )
}

Course.displayName = "Course"

export default withAdmin(Course)
