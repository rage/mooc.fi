/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatisticsCumulativeAtLeastOneExercise
// ====================================================

export interface CourseStatisticsCumulativeAtLeastOneExercise_course_course_statistics_cumulative_at_least_one_exercise {
  __typename: "DatedInt";
  value: number | null;
  date: any | null;
}

export interface CourseStatisticsCumulativeAtLeastOneExercise_course_course_statistics {
  __typename: "CourseStatistics";
  cumulative_at_least_one_exercise: (CourseStatisticsCumulativeAtLeastOneExercise_course_course_statistics_cumulative_at_least_one_exercise | null)[] | null;
}

export interface CourseStatisticsCumulativeAtLeastOneExercise_course {
  __typename: "Course";
  id: string;
  name: string;
  course_statistics: CourseStatisticsCumulativeAtLeastOneExercise_course_course_statistics | null;
}

export interface CourseStatisticsCumulativeAtLeastOneExercise {
  course: CourseStatisticsCumulativeAtLeastOneExercise_course | null;
}

export interface CourseStatisticsCumulativeAtLeastOneExerciseVariables {
  slug?: string | null;
}
