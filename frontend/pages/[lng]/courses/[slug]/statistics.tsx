import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"
import { gql, useLazyQuery, useQuery } from "@apollo/client"
import Container from "/components/Container"
// import Spinner from "/components/Spinner"
// import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import type { CourseStatistics } from "/static/types/generated/CourseStatistics"
import { CourseStatisticsStartedCumulative } from "/static/types/generated/CourseStatisticsStartedCumulative"
import { CourseStatisticsCompletedCumulative } from "/static/types/generated/CourseStatisticsCompletedCumulative"
import { CourseStatisticsAtLeastOneExerciseCumulative } from "/static/types/generated/CourseStatisticsAtLeastOneExerciseCumulative"
import { CourseStatisticsAtLeastOneExerciseByInterval } from "/static/types/generated/CourseStatisticsAtLeastOneExerciseByInterval"
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

const CourseStatisticsStartedCumulativeQuery = gql`
  query CourseStatisticsStartedCumulative($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      course_statistics {
        course_id
        started_cumulative {
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

const CourseStatisticsCompletedCumulativeQuery = gql`
  query CourseStatisticsCompletedCumulative($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      course_statistics {
        course_id
        completed_cumulative {
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

const CourseStatisticsAtLeastOneExerciseCumulativeQuery = gql`
  query CourseStatisticsAtLeastOneExerciseCumulative($slug: String) {
    course(slug: $slug) {
      id
      slug
      name
      course_statistics {
        course_id
        at_least_one_exercise_cumulative {
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

const CourseStatisticsAtLeastOneExerciseByIntervalQuery = gql`
  query CourseStatisticsAtLeastOneExerciseByIntervalQuery($slug: String, $number: Int, $unit: IntervalUnit) {
    course(slug: $slug) {
      id
      slug
      name
      course_statistics {
        course_id
        at_least_one_exercise_by_interval(number: $number, unit: $unit) {
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
  const [getStartedCumulative, {
    data: startedCumulativeData,
    loading: startedCumulativeLoading,
    error: startedCumulativeError,
  }] = useLazyQuery<CourseStatisticsStartedCumulative>(
    CourseStatisticsStartedCumulativeQuery,
    {
      variables: { slug },
    },
  )
  const [getCompletedCumulative, {
    data: completedCumulativeData,
    loading: completedCumulativeLoading,
    error: completedCumulativeError,
  }] = useLazyQuery<CourseStatisticsCompletedCumulative>(
    CourseStatisticsCompletedCumulativeQuery,
    {
      variables: { slug },
    },
  )
  const [getAtLeastOneExerciseCumulative, {
    data: atLeastOneExerciseCumulativeData,
    loading: atLeastOneExerciseCumulativeLoading,
    error: atLeastOneExerciseCumulativeError,
  }] = useLazyQuery<CourseStatisticsAtLeastOneExerciseCumulative>(
    CourseStatisticsAtLeastOneExerciseCumulativeQuery,
    {
      variables: { slug },
    },
  )

  const [getAtLeastOneExerciseByInterval, {
    data: atLeastOneExerciseByIntervalData,
    loading: atLeastOneExerciseByIntervalLoading,
    error: atLeastOneExerciseByIntervalError,
  }] = useLazyQuery<CourseStatisticsAtLeastOneExerciseByInterval>(
    CourseStatisticsAtLeastOneExerciseByIntervalQuery,
    {
      variables: { slug, unit: "day" },
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
              name: "started_cumulative",
              label: t("started_cumulative"),
              fetch: getStartedCumulative,
              value:
                startedCumulativeData?.course?.course_statistics
                  ?.started_cumulative,
              loading: startedCumulativeLoading,
              error: startedCumulativeError,
            },
            {
              name: "completed_cumulative",
              label: t("completed_cumulative"),
              value:
                completedCumulativeData?.course?.course_statistics
                  ?.completed_cumulative,
              loading: completedCumulativeLoading,
              error: completedCumulativeError,
            },
            [{
              name: "at_least_one_exercise",
              label: t("at_least_one_exercise_cumulative"),
              value:
                atLeastOneExerciseCumulativeData?.course?.course_statistics
                  ?.at_least_one_exercise_cumulative,
              loading: atLeastOneExerciseCumulativeLoading,
              error: atLeastOneExerciseCumulativeError,
            },
            {
              name: "at_least_one_exercise_by_interval",
              label: "At least one exercise",
              value:
                atLeastOneExerciseByIntervalData?.course?.course_statistics
                  ?.at_least_one_exercise_by_interval,
              loading: atLeastOneExerciseByIntervalLoading,
              error: atLeastOneExerciseByIntervalError,
            }],
          ]}
          label="Stats"
          updated_at={
            startedCumulativeData?.course?.course_statistics?.started_cumulative
              ?.updated_at
          }
        />
        {/*<Graph
          name="started_cumulative"
          label={t("started_cumulative")}
          value={startedCumulativeData?.course?.course_statistics?.cumulative_started}
          loading={startedCumulativeLoading}
          error={startedCumulativeError}
        />
        <Graph
          name="completed_cumulative"
          label={t("completed_cumulative")}
          value={completedCumulativeData?.course?.course_statistics?.cumulative_completed}
          loading={completedCumulativeLoading}
          error={completedCumulativeError}
        />
        <Graph
          name="at_least_one_exercise_cumulative"
          label={t("at_least_one_exercise_cumulative")}
          value={atLeastOneExerciseCumulativeData?.course?.course_statistics?.cumulative_at_least_one_exercise}
          loading={atLeastOneExerciseCumulativeLoading}
          error={atLeastOneExerciseCumulativeError}
        />*/}
      </Container>
    </>
  )
}

export default withAdmin(CourseStatisticsPage)
