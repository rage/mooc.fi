/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HandlerCourses
// ====================================================

export interface HandlerCourses_handlerCourses {
  __typename: "Course";
  id: string;
  slug: string;
  name: string;
}

export interface HandlerCourses {
  handlerCourses: (HandlerCourses_handlerCourses | null)[] | null;
}
