/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckSlug
// ====================================================

export interface CheckSlug_course {
<<<<<<< HEAD
  __typename: "Course"
  id: string
  slug: string
  name: string
<<<<<<< HEAD
  description: string | null
  instructions: string | null
=======
>>>>>>> 67f338cb (options for charts, synced charts etc.)
=======
  __typename: "Course";
  id: string;
  slug: string;
  name: string;
>>>>>>> 9b8932d9 (able to group charts)
}

export interface CheckSlug {
  course: CheckSlug_course | null;
}

export interface CheckSlugVariables {
  slug: string;
}
