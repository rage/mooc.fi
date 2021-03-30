import React from "react"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"
import { gql, useQuery } from "@apollo/client"
import Container from "/components/Container"
import Spinner from "/components/Spinner"
import ModifiableErrorMesage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import { CourseStatistics as CourseStatisticsData } from "/static/types/generated/CourseStatistics"
import CourseStatisticsList from "/components/Dashboard/Courses/CourseStatisticsList"

export const CourseStatisticsQuery = gql`
  query CourseStatistics($slug: String) {
    course(slug: $slug) {
      id
      name
      course_statistics {
        started {
          value
          date
        }
        completed {
          value
          date
        }
        atLeastOneExercise {
          value
          date
        }
      }
    }
  }
`
function CourseStatistics() {
  const t = useTranslator(CoursesTranslations)

  const slug = useQueryParameter("slug")

  const { data, loading, error } = useQuery<CourseStatisticsData>(
    CourseStatisticsQuery,
    {
      variables: { slug },
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
    <>
      <DashboardTabBar slug={slug} selectedValue={3} />

      <Container>
        <H1NoBackground component="h1" variant="h1" align="center">
          {data.course.name}
        </H1NoBackground>

        <CourseStatisticsList data={data.course.course_statistics} />
      </Container>
    </>
  )
}

export default withAdmin(CourseStatistics)
