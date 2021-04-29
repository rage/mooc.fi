/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseStatistics
// ====================================================

export interface CourseStatistics_course_course_statistics_started {
  __typename: "DatedInt";
  value: number | null;
  date: any | null;
}

export interface CourseStatistics_course_course_statistics_completed {
  __typename: "DatedInt";
  value: number | null;
  date: any | null;
}

export interface CourseStatistics_course_course_statistics_at_least_one_exercise {
  __typename: "DatedInt";
  value: number | null;
  date: any | null;
}

export interface CourseStatistics_course_course_statistics {
  __typename: "CourseStatistics";
  id: string | null;
  started: CourseStatistics_course_course_statistics_started | null;
  completed: CourseStatistics_course_course_statistics_completed | null;
  at_least_one_exercise: CourseStatistics_course_course_statistics_at_least_one_exercise | null;
}

export interface CourseStatistics_course {
  __typename: "Course";
  id: string;
  name: string;
  course_statistics: CourseStatistics_course_course_statistics | null;
}

export interface CourseStatistics {
  course: CourseStatistics_course | null;
}

export interface CourseStatisticsVariables {
  slug?: string | null;
}
