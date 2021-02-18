/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BreadcrumbCourse
// ====================================================

export interface BreadcrumbCourse_course {
  __typename: "Course";
  id: string;
  slug: string;
  name: string;
}

export interface BreadcrumbCourse {
  course: BreadcrumbCourse_course | null;
}

export interface BreadcrumbCourseVariables {
  slug?: string | null;
  language?: string | null;
  translationFallback?: boolean | null;
}
