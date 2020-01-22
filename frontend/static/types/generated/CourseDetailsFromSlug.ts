/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseDetailsFromSlug
// ====================================================

export interface CourseDetailsFromSlug_course {
  __typename: "Course";
  id: any;
  name: string;
}

export interface CourseDetailsFromSlug {
  course: CourseDetailsFromSlug_course | null;
}

export interface CourseDetailsFromSlugVariables {
  slug?: string | null;
}
