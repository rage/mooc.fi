/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckSlug
// ====================================================

export interface CheckSlug_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  description: string | null
  instructions: string | null
}

export interface CheckSlug {
  course: CheckSlug_course | null;
}

export interface CheckSlugVariables {
  slug: string;
}
