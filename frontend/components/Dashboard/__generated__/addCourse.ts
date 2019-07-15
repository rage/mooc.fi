/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: addCourse
// ====================================================

export interface addCourse_addCourse_photo {
  __typename: "Image";
  id: any;
  compressed: string | null;
  compressed_mimetype: string | null;
  uncompressed: string;
  uncompressed_mimetype: string;
}

export interface addCourse_addCourse {
  __typename: "Course";
  id: any;
  slug: string;
  photo: addCourse_addCourse_photo | null;
}

export interface addCourse {
  addCourse: addCourse_addCourse;
}

export interface addCourseVariables {
  name?: string | null;
  slug?: string | null;
  photo?: string | null;
  promote?: boolean | null;
  start_point?: boolean | null;
  status?: CourseStatus | null;
}
