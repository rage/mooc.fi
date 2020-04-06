/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseEditorCourses
// ====================================================

export interface CourseEditorCourses_courses_course_translations {
  __typename: "CourseTranslation";
  id: any;
  name: string;
  language: string;
}

export interface CourseEditorCourses_courses_photo {
  __typename: "Image";
  id: any;
  name: string | null;
  original: string;
  original_mimetype: string;
  compressed: string | null;
  compressed_mimetype: string | null;
  uncompressed: string;
  uncompressed_mimetype: string;
}

export interface CourseEditorCourses_courses {
  __typename: "Course";
  id: any;
  slug: string;
  name: string;
  course_translations: CourseEditorCourses_courses_course_translations[] | null;
  photo: CourseEditorCourses_courses_photo | null;
}

export interface CourseEditorCourses {
  courses: CourseEditorCourses_courses[];
}
