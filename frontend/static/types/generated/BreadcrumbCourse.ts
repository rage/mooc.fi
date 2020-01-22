/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BreadcrumbCourse
// ====================================================

export interface BreadcrumbCourse_course_course_translations {
  __typename: "CourseTranslation";
  id: any;
  language: string;
  name: string;
}

export interface BreadcrumbCourse_course {
  __typename: "Course";
  id: any;
  slug: string;
  name: string;
  course_translations: BreadcrumbCourse_course_course_translations[] | null;
}

export interface BreadcrumbCourse {
  course: BreadcrumbCourse_course | null;
}

export interface BreadcrumbCourseVariables {
  slug?: string | null;
}
