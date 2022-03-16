/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatisticsStartedCumulative
// ====================================================

export interface CourseStatisticsStartedCumulative_course_course_statistics_started_cumulative_data {
  __typename: "CourseStatisticsValue"
  value: number | null
  date: any | null
}

export interface CourseStatisticsStartedCumulative_course_course_statistics_started_cumulative {
  __typename: "CourseStatisticsEntry"
  updated_at: any | null
  data: CourseStatisticsStartedCumulative_course_course_statistics_started_cumulative_data[]
}

export interface CourseStatisticsStartedCumulative_course_course_statistics {
  __typename: "CourseStatistics"
  course_id: string | null
  started_cumulative: CourseStatisticsStartedCumulative_course_course_statistics_started_cumulative | null
}

export interface CourseStatisticsStartedCumulative_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  course_statistics: CourseStatisticsStartedCumulative_course_course_statistics | null
}

export interface CourseStatisticsStartedCumulative {
  course: CourseStatisticsStartedCumulative_course | null
}

export interface CourseStatisticsStartedCumulativeVariables {
  slug?: string | null
}
