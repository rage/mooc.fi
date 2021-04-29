/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatisticsCumulativeStarted
// ====================================================

export interface CourseStatisticsCumulativeStarted_course_course_statistics_cumulative_started {
  __typename: "DatedInt";
  value: number | null;
  date: any | null;
}

export interface CourseStatisticsCumulativeStarted_course_course_statistics {
  __typename: "CourseStatistics";
  id: string | null;
  cumulative_started: (CourseStatisticsCumulativeStarted_course_course_statistics_cumulative_started | null)[] | null;
}

export interface CourseStatisticsCumulativeStarted_course {
  __typename: "Course";
  id: string;
  name: string;
  course_statistics: CourseStatisticsCumulativeStarted_course_course_statistics | null;
}

export interface CourseStatisticsCumulativeStarted {
  course: CourseStatisticsCumulativeStarted_course | null;
}

export interface CourseStatisticsCumulativeStartedVariables {
  slug?: string | null;
}
