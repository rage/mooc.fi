/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatisticsCompletedCumulative
// ====================================================

export interface CourseStatisticsCompletedCumulative_course_course_statistics_completed_cumulative_data {
  __typename: "CourseStatisticsValue"
  value: number | null
  date: any | null
}

export interface CourseStatisticsCompletedCumulative_course_course_statistics_completed_cumulative {
  __typename: "CourseStatisticsEntry"
  updated_at: any | null
  data: CourseStatisticsCompletedCumulative_course_course_statistics_completed_cumulative_data[]
}

export interface CourseStatisticsCompletedCumulative_course_course_statistics {
  __typename: "CourseStatistics"
  course_id: string | null
  completed_cumulative: CourseStatisticsCompletedCumulative_course_course_statistics_completed_cumulative | null
}

export interface CourseStatisticsCompletedCumulative_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  course_statistics: CourseStatisticsCompletedCumulative_course_course_statistics | null
}

export interface CourseStatisticsCompletedCumulative {
  course: CourseStatisticsCompletedCumulative_course | null
}

export interface CourseStatisticsCompletedCumulativeVariables {
  slug?: string | null
}
