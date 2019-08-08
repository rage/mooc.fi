/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseDetailsFromSlugQuery
// ====================================================

export interface CourseDetailsFromSlugQuery_course {
  __typename: "Course";
  id: any;
  name: string;
}

export interface CourseDetailsFromSlugQuery {
  course: CourseDetailsFromSlugQuery_course;
}

export interface CourseDetailsFromSlugQueryVariables {
  slug?: string | null;
}
