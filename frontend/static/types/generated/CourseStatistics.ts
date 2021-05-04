/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatistics
// ====================================================

export interface CourseStatistics_course_course_statistics_started_data {
  __typename: "DatedInt"
  value: number | null
  date: any | null
}

export interface CourseStatistics_course_course_statistics_started {
  __typename: "CourseStatisticsEntry"
  updated_at: any | null
  data: CourseStatistics_course_course_statistics_started_data[]
}

export interface CourseStatistics_course_course_statistics_completed_data {
  __typename: "DatedInt"
  value: number | null
  date: any | null
}

export interface CourseStatistics_course_course_statistics_completed {
  __typename: "CourseStatisticsEntry"
  updated_at: any | null
  data: CourseStatistics_course_course_statistics_completed_data[]
}

export interface CourseStatistics_course_course_statistics_at_least_one_exercise_data {
  __typename: "DatedInt"
  value: number | null
  date: any | null
}

export interface CourseStatistics_course_course_statistics_at_least_one_exercise {
  __typename: "CourseStatisticsEntry"
  updated_at: any | null
  data: CourseStatistics_course_course_statistics_at_least_one_exercise_data[]
}

export interface CourseStatistics_course_course_statistics {
  __typename: "CourseStatistics"
  course_id: string | null
  started: CourseStatistics_course_course_statistics_started | null
  completed: CourseStatistics_course_course_statistics_completed | null
  at_least_one_exercise: CourseStatistics_course_course_statistics_at_least_one_exercise | null
}

export interface CourseStatistics_course {
  __typename: "Course"
  id: string
  name: string
  slug: string
  course_statistics: CourseStatistics_course_course_statistics | null
}

export interface CourseStatistics {
  course: CourseStatistics_course | null
}

export interface CourseStatisticsVariables {
  slug?: string | null
}
