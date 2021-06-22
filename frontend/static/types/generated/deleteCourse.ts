/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteCourse
// ====================================================

export interface deleteCourse_deleteCourse {
  __typename: "Course";
  id: string;
  slug: string;
}

export interface deleteCourse {
  deleteCourse: deleteCourse_deleteCourse | null;
}

export interface deleteCourseVariables {
  id: string;
}
