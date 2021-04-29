import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"
import { gql, useQuery } from "@apollo/client"
import Container from "/components/Container"
import Spinner from "/components/Spinner"
import ModifiableErrorMesage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import type { CourseStatistics } from "/static/types/generated/CourseStatistics"
import CourseStatisticsList from "/components/Dashboard/Courses/CourseStatisticsList"
import { CourseStatisticsCumulativeStarted } from "/static/types/generated/CourseStatisticsCumulativeStarted"
import { CourseStatisticsCumulativeCompleted } from "/static/types/generated/CourseStatisticsCumulativeCompleted"
import { CourseStatisticsCumulativeAtLeastOneExercise } from "/static/types/generated/CourseStatisticsCumulativeAtLeastOneExercise"
import Graph from "/components/Dashboard/Courses/Statistics/Graph"
import notEmpty from "/util/notEmpty"

export const CourseStatisticsQuery = gql`
  query CourseStatistics($slug: String) {
    course(slug: $slug) {
      id
      name
      slug
      course_statistics {
        course_id
        started {
          value
          date
        }
        completed {
          value
          date
        }
        at_least_one_exercise {
          value
          date
        }
      }
    }
  }
`

const CourseStatisticsCumulativeStartedQuery = gql`
  query CourseStatisticsCumulativeStarted($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      course_statistics {
        course_id
        cumulative_started {
          value
          date
        }
      }
    }
  }
`

const CourseStatisticsCumulativeCompletedQuery = gql`
  query CourseStatisticsCumulativeCompleted($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      course_statistics {
        course_id
        cumulative_completed {
          value
          date
        }
      }
    }
  }
`

const CourseStatisticsCumulativeAtLeastOneExerciseQuery = gql`
  query CourseStatisticsCumulativeAtLeastOneExercise($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      course_statistics {
        course_id
        cumulative_at_least_one_exercise {
          parent
          value
          date
        }
      }
    }
  }
`

function CourseStatisticsPage() {
  const t = useTranslator(CoursesTranslations)

  const slug = useQueryParameter("slug")

  const { data: currentData, loading: currentLoading, error: currentError } = useQuery<CourseStatistics>(
    CourseStatisticsQuery,
    {
      variables: { slug },
    },
  )
  const {
    data: cumulativeStartedData,
    loading: cumulativeStartedLoading,
    error: cumulativeStartedError
  } = useQuery<CourseStatisticsCumulativeStarted>(
    CourseStatisticsCumulativeStartedQuery,
    {
      variables: { slug },
    },
  )
  const {
    data: cumulativeCompletedData,
    loading: cumulativeCompletedLoading,
    error: cumulativeCompletedError
  } = useQuery<CourseStatisticsCumulativeCompleted>(
    CourseStatisticsCumulativeCompletedQuery,
    {
      variables: { slug },
    },
  )
  const {
    data: cumulativeAtLeastOneExerciseData,
    loading: cumulativeAtLeastOneExerciseLoading,
    error: cumulativeAtLeastOneExerciseError
  } = useQuery<CourseStatisticsCumulativeAtLeastOneExercise>(
    CourseStatisticsCumulativeAtLeastOneExerciseQuery,
    {
      variables: { slug },
    },
  )


  if (currentLoading || !currentData) {
    return <Spinner />
  }

  if (currentError) {
    return <ModifiableErrorMesage errorMessage={JSON.stringify(currentError)} />
  }

  if (!currentData.course) {
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
          {currentData.course.name}
        </H1NoBackground>

        <CourseStatisticsList data={currentData.course.course_statistics} />
        <Graph 
          data={cumulativeStartedData?.course?.course_statistics?.cumulative_started?.filter(notEmpty)}
          label="Cumulative started"
          />
        <Graph 
          data={cumulativeCompletedData?.course?.course_statistics?.cumulative_completed?.filter(notEmpty)}
          label="Cumulative completed"
          />
        <Graph 
          data={cumulativeAtLeastOneExerciseData?.course?.course_statistics?.cumulative_at_least_one_exercise?.filter(notEmpty)}
          label="Cumulative at least one exercise submitted"
          />
      </Container>
    </>
  )
} 

export default withAdmin(CourseStatisticsPage)
