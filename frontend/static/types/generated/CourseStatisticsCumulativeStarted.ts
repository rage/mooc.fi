/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatisticsCumulativeStarted
// ====================================================

export interface CourseStatisticsCumulativeStarted_course_course_statistics_cumulative_started_data {
  __typename: "DatedInt"
  value: number | null
  date: any | null
}

export interface CourseStatisticsCumulativeStarted_course_course_statistics_cumulative_started {
  __typename: "CourseStatisticsEntry"
  updated_at: any | null
  data: CourseStatisticsCumulativeStarted_course_course_statistics_cumulative_started_data[]
}

export interface CourseStatisticsCumulativeStarted_course_course_statistics {
  __typename: "CourseStatistics"
  course_id: string | null
  cumulative_started: CourseStatisticsCumulativeStarted_course_course_statistics_cumulative_started | null
}

export interface CourseStatisticsCumulativeStarted_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  course_statistics: CourseStatisticsCumulativeStarted_course_course_statistics | null
}

export interface CourseStatisticsCumulativeStarted {
  course: CourseStatisticsCumulativeStarted_course | null
}

export interface CourseStatisticsCumulativeStartedVariables {
  slug?: string | null
}
