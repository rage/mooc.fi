/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateCourseTranslation
// ====================================================

export interface updateCourseTranslation_updateCourseTranslation {
  __typename: "CourseTranslation";
  id: any;
}

export interface updateCourseTranslation {
  updateCourseTranslation: updateCourseTranslation_updateCourseTranslation;
}

export interface updateCourseTranslationVariables {
  id: string;
  language: string;
  name: string;
  description?: string | null;
  link?: string | null;
  course?: string | null;
}
