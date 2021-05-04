import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"
import { gql, useQuery } from "@apollo/client"
import Container from "/components/Container"
// import Spinner from "/components/Spinner"
// import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import type { CourseStatistics } from "/static/types/generated/CourseStatistics"
import { CourseStatisticsCumulativeStarted } from "/static/types/generated/CourseStatisticsCumulativeStarted"
import { CourseStatisticsCumulativeCompleted } from "/static/types/generated/CourseStatisticsCumulativeCompleted"
import { CourseStatisticsCumulativeAtLeastOneExercise } from "/static/types/generated/CourseStatisticsCumulativeAtLeastOneExercise"
import Graph from "/components/Dashboard/Courses/Statistics/Graph"
import { Paper } from "@material-ui/core"
import CourseStatisticsEntry from "/components/Dashboard/Courses/Statistics/CourseStatisticsEntry"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { Alert, AlertTitle, Skeleton } from "@material-ui/core"
import CommonTranslations from "/translations/common"

export const CourseStatisticsQuery = gql`
  query CourseStatistics($slug: String) {
    course(slug: $slug) {
      id
      name
      slug
      course_statistics {
        course_id
        started {
          updated_at
          data {
            value
            date
          }
        }
        completed {
          updated_at
          data {
            value
            date
          }
        }
        at_least_one_exercise {
          updated_at
          data {
            value
            date
          }
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
          updated_at
          data {
            value
            date
          }
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
          updated_at
          data {
            value
            date
          }
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
          updated_at
          data {
            value
            date
          }
        }
      }
    }
  }
`

function CourseStatisticsPage() {
  const t = useTranslator(CoursesTranslations, CommonTranslations)

  const slug = useQueryParameter("slug")

  const {
    data: currentData,
    loading: currentLoading,
    error: currentError,
  } = useQuery<CourseStatistics>(CourseStatisticsQuery, {
    variables: { slug },
  })
  const {
    data: cumulativeStartedData,
    loading: cumulativeStartedLoading,
    error: cumulativeStartedError,
  } = useQuery<CourseStatisticsCumulativeStarted>(
    CourseStatisticsCumulativeStartedQuery,
    {
      variables: { slug },
    },
  )
  const {
    data: cumulativeCompletedData,
    loading: cumulativeCompletedLoading,
    error: cumulativeCompletedError,
  } = useQuery<CourseStatisticsCumulativeCompleted>(
    CourseStatisticsCumulativeCompletedQuery,
    {
      variables: { slug },
    },
  )
  const {
    data: cumulativeAtLeastOneExerciseData,
    loading: cumulativeAtLeastOneExerciseLoading,
    error: cumulativeAtLeastOneExerciseError,
  } = useQuery<CourseStatisticsCumulativeAtLeastOneExercise>(
    CourseStatisticsCumulativeAtLeastOneExerciseQuery,
    {
      variables: { slug },
    },
  )

  const course_exists = Boolean(currentData?.course?.id)

  useBreadcrumbs([
    {
      translation: "courses",
      href: `/courses`,
    },
    {
      label:
        currentData?.course?.name ??
        (!currentLoading && !course_exists ? slug : undefined),
      href: `/courses/${slug}`,
    },
    {
      translation: "courseStatistics",
      href: `/courses/${slug}/statistics`,
    },
  ])

  /*if (currentLoading) {
    return <Spinner />
  }*/

  /*if (currentError || !currentData) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(currentError)} />
  }*/

  if (!currentError && !currentLoading && !currentData?.course) {
    return (
      <Container>
        <p>{t("courseNotFound")}</p>
      </Container>
    )
  }

  return (
    <>
      <DashboardTabBar slug={slug} selectedValue={3} />

      <Container>
        <H1NoBackground component="h1" variant="h1" align="center">
          {currentLoading ? <Skeleton /> : currentData?.course?.name}
        </H1NoBackground>

        <Paper elevation={3}>
          {currentError ? (
            <Alert severity="error">
              <AlertTitle>Error loading statistics</AlertTitle>
              <pre>{JSON.stringify(currentError, undefined, 2)}</pre>
            </Alert>
          ) : (
            <>
              <CourseStatisticsEntry
                name="started"
                label={t("started")}
                value={currentData?.course?.course_statistics?.started}
                loading={currentLoading}
                error={Boolean(currentError)}
              />
              <CourseStatisticsEntry
                name="completed"
                label={t("completed")}
                value={currentData?.course?.course_statistics?.completed}
                loading={currentLoading}
                error={Boolean(currentError)}
              />
              <CourseStatisticsEntry
                name="atLeastOneExercise"
                label={t("atLeastOneExercise")}
                value={
                  currentData?.course?.course_statistics?.at_least_one_exercise
                }
                loading={currentLoading}
                error={Boolean(currentError)}
              />
            </>
          )}
        </Paper>
        <Graph
          values={[
            {
              name: "cumulative_started",
              label: t("cumulative_started"),
              value:
                cumulativeStartedData?.course?.course_statistics
                  ?.cumulative_started,
              loading: cumulativeStartedLoading,
              error: cumulativeStartedError,
            },
            {
              name: "cumulative_completed",
              label: t("cumulative_completed"),
              value:
                cumulativeCompletedData?.course?.course_statistics
                  ?.cumulative_completed,
              loading: cumulativeCompletedLoading,
              error: cumulativeCompletedError,
            },
            {
              name: "cumulative_at_least_one_exercise",
              label: t("cumulative_at_least_one_exercise"),
              value:
                cumulativeAtLeastOneExerciseData?.course?.course_statistics
                  ?.cumulative_at_least_one_exercise,
              loading: cumulativeAtLeastOneExerciseLoading,
              error: cumulativeAtLeastOneExerciseError,
            },
          ]}
          label="Stats"
          updated_at={
            cumulativeStartedData?.course?.course_statistics?.cumulative_started
              ?.updated_at
          }
        />
        {/*<Graph
          name="cumulative_started"
          label={t("cumulative_started")}
          value={cumulativeStartedData?.course?.course_statistics?.cumulative_started}
          loading={cumulativeStartedLoading}
          error={cumulativeStartedError}
        />
        <Graph
          name="cumulative_completed"
          label={t("cumulative_completed")}
          value={cumulativeCompletedData?.course?.course_statistics?.cumulative_completed}
          loading={cumulativeCompletedLoading}
          error={cumulativeCompletedError}
        />
        <Graph
          name="cumulative_at_least_one_exercise"
          label={t("cumulative_at_least_one_exercise")}
          value={cumulativeAtLeastOneExerciseData?.course?.course_statistics?.cumulative_at_least_one_exercise}
          loading={cumulativeAtLeastOneExerciseLoading}
          error={cumulativeAtLeastOneExerciseError}
        />*/}
      </Container>
    </>
  )
}

export default withAdmin(CourseStatisticsPage)
