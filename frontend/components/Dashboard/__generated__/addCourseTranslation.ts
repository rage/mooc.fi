/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addCourseTranslation
// ====================================================

export interface addCourseTranslation_addCourseTranslation {
  __typename: "CourseTranslation";
  id: any;
}

export interface addCourseTranslation {
  addCourseTranslation: addCourseTranslation_addCourseTranslation;
}

export interface addCourseTranslationVariables {
  language: string;
  name: string;
  description?: string | null;
  link?: string | null;
  course: string;
}
