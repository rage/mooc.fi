/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatisticsAtLeastOneExerciseCumulative
// ====================================================

export interface CourseStatisticsAtLeastOneExerciseCumulative_course_course_statistics_at_least_one_exercise_cumulative_data {
  __typename: "CourseStatisticsValue"
  value: number | null
  date: any | null
}

export interface CourseStatisticsAtLeastOneExerciseCumulative_course_course_statistics_at_least_one_exercise_cumulative {
  __typename: "CourseStatisticsEntry"
  updated_at: any | null
  data: CourseStatisticsAtLeastOneExerciseCumulative_course_course_statistics_at_least_one_exercise_cumulative_data[]
}

export interface CourseStatisticsAtLeastOneExerciseCumulative_course_course_statistics {
  __typename: "CourseStatistics"
  course_id: string | null
  at_least_one_exercise_cumulative: CourseStatisticsAtLeastOneExerciseCumulative_course_course_statistics_at_least_one_exercise_cumulative | null
}

export interface CourseStatisticsAtLeastOneExerciseCumulative_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  course_statistics: CourseStatisticsAtLeastOneExerciseCumulative_course_course_statistics | null
}

export interface CourseStatisticsAtLeastOneExerciseCumulative {
  course: CourseStatisticsAtLeastOneExerciseCumulative_course | null
}

export interface CourseStatisticsAtLeastOneExerciseCumulativeVariables {
  slug?: string | null
}
