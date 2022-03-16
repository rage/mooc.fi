/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IntervalUnit } from "./globalTypes"

// ====================================================
// GraphQL query operation: CourseStatisticsAtLeastOneExerciseByInterval
// ====================================================

export interface CourseStatisticsAtLeastOneExerciseByInterval_course_course_statistics_at_least_one_exercise_by_interval_data {
  __typename: "CourseStatisticsValue"
  value: number | null
  date: any | null
}

export interface CourseStatisticsAtLeastOneExerciseByInterval_course_course_statistics_at_least_one_exercise_by_interval {
  __typename: "CourseStatisticsEntry"
  updated_at: any | null
  data: CourseStatisticsAtLeastOneExerciseByInterval_course_course_statistics_at_least_one_exercise_by_interval_data[]
}

export interface CourseStatisticsAtLeastOneExerciseByInterval_course_course_statistics {
  __typename: "CourseStatistics"
  course_id: string | null
  at_least_one_exercise_by_interval: CourseStatisticsAtLeastOneExerciseByInterval_course_course_statistics_at_least_one_exercise_by_interval | null
}

export interface CourseStatisticsAtLeastOneExerciseByInterval_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  course_statistics: CourseStatisticsAtLeastOneExerciseByInterval_course_course_statistics | null
}

export interface CourseStatisticsAtLeastOneExerciseByInterval {
  course: CourseStatisticsAtLeastOneExerciseByInterval_course | null
}

export interface CourseStatisticsAtLeastOneExerciseByIntervalVariables {
  slug?: string | null
  number?: number | null
  unit?: IntervalUnit | null
}
