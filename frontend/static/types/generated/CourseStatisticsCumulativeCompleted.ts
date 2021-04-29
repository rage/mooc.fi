/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatisticsCumulativeCompleted
// ====================================================

export interface CourseStatisticsCumulativeCompleted_course_course_statistics_cumulative_completed {
  __typename: "DatedInt";
  value: number | null;
  date: any | null;
}

export interface CourseStatisticsCumulativeCompleted_course_course_statistics {
  __typename: "CourseStatistics";
  id: string | null;
  cumulative_completed: (CourseStatisticsCumulativeCompleted_course_course_statistics_cumulative_completed | null)[] | null;
}

export interface CourseStatisticsCumulativeCompleted_course {
  __typename: "Course";
  id: string;
  name: string;
  course_statistics: CourseStatisticsCumulativeCompleted_course_course_statistics | null;
}

export interface CourseStatisticsCumulativeCompleted {
  course: CourseStatisticsCumulativeCompleted_course | null;
}

export interface CourseStatisticsCumulativeCompletedVariables {
  slug?: string | null;
}
