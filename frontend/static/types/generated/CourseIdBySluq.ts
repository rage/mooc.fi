/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseIdBySluq
// ====================================================

export interface CourseIdBySluq_course {
  __typename: "Course";
  id: string;
}

export interface CourseIdBySluq {
  course: CourseIdBySluq_course | null;
}

export interface CourseIdBySluqVariables {
  slug?: string | null;
}
