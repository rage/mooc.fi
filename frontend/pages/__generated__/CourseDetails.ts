/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: CourseDetails
// ====================================================

export interface CourseDetails_course_photo {
  __typename: "Image";
  id: any;
  compressed: string | null;
  compressed_mimetype: string | null;
  uncompressed: string;
  uncompressed_mimetype: string;
}

export interface CourseDetails_course_course_translations {
  __typename: "CourseTranslation";
  id: any;
  name: string;
  language: string;
  description: string;
  link: string;
}

export interface CourseDetails_course_study_module {
  __typename: "StudyModule";
  id: any;
}

export interface CourseDetails_course {
  __typename: "Course";
  id: any;
  name: string;
  slug: string;
  photo: CourseDetails_course_photo | null;
  promote: boolean | null;
  start_point: boolean | null;
  status: CourseStatus | null;
  course_translations: CourseDetails_course_course_translations[] | null;
  study_module: CourseDetails_course_study_module | null;
}

export interface CourseDetails {
  course: CourseDetails_course;
}

export interface CourseDetailsVariables {
  slug?: string | null;
}
