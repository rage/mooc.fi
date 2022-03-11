/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllCoursesDetails
// ====================================================

export interface AllCoursesDetails_courses_completion_email {
  __typename: "EmailTemplate";
  name: string | null;
  id: string;
}

export interface AllCoursesDetails_courses_course_stats_email {
  __typename: "EmailTemplate";
  id: string;
}

export interface AllCoursesDetails_courses {
  __typename: "Course";
  id: string;
  slug: string;
  name: string;
  teacher_in_charge_name: string;
  teacher_in_charge_email: string;
  start_date: string;
  completion_email: AllCoursesDetails_courses_completion_email | null;
  course_stats_email: AllCoursesDetails_courses_course_stats_email | null;
}

export interface AllCoursesDetails {
  courses: (AllCoursesDetails_courses | null)[] | null;
}
