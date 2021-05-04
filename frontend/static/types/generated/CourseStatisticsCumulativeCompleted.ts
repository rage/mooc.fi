/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatisticsCumulativeCompleted
// ====================================================

export interface CourseStatisticsCumulativeCompleted_course_course_statistics_cumulative_completed_data {
  __typename: "DatedInt"
  value: number | null
  date: any | null
}

export interface CourseStatisticsCumulativeCompleted_course_course_statistics_cumulative_completed {
  __typename: "CourseStatisticsEntry"
  updated_at: any | null
  data: CourseStatisticsCumulativeCompleted_course_course_statistics_cumulative_completed_data[]
}

export interface CourseStatisticsCumulativeCompleted_course_course_statistics {
  __typename: "CourseStatistics"
  course_id: string | null
  cumulative_completed: CourseStatisticsCumulativeCompleted_course_course_statistics_cumulative_completed | null
}

export interface CourseStatisticsCumulativeCompleted_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  course_statistics: CourseStatisticsCumulativeCompleted_course_course_statistics | null
}

export interface CourseStatisticsCumulativeCompleted {
  course: CourseStatisticsCumulativeCompleted_course | null
}

export interface CourseStatisticsCumulativeCompletedVariables {
  slug?: string | null
}
