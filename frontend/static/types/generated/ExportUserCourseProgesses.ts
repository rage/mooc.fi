/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ExportUserCourseProgesses
// ====================================================

export interface ExportUserCourseProgesses_UserCourseProgresses_user {
  __typename: "User";
  id: any;
  email: string;
  student_number: string | null;
  real_student_number: string | null;
  upstream_id: number;
  first_name: string | null;
  last_name: string | null;
}

export interface ExportUserCourseProgesses_UserCourseProgresses_UserCourseSettings {
  __typename: "UserCourseSettings";
  course_variant: string | null;
  country: string | null;
  language: string | null;
}

export interface ExportUserCourseProgesses_UserCourseProgresses {
  __typename: "UserCourseProgress";
  id: any;
  user: ExportUserCourseProgesses_UserCourseProgresses_user;
  progress: any;
  UserCourseSettings: ExportUserCourseProgesses_UserCourseProgresses_UserCourseSettings | null;
}

export interface ExportUserCourseProgesses {
  UserCourseProgresses: ExportUserCourseProgesses_UserCourseProgresses[];
}

export interface ExportUserCourseProgessesVariables {
  course_slug: string;
  after?: string | null;
  first?: number | null;
}
