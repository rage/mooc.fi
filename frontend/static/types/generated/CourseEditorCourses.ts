/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseEditorCourses
// ====================================================

export interface CourseEditorCourses_courses_course_translation {
  __typename: "course_translation"
  id: string
  name: string
  language: string
}

export interface CourseEditorCourses_courses_photo {
  __typename: "image"
  id: string
  name: string | null
  original: string
  original_mimetype: string
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string
  uncompressed_mimetype: string
}

export interface CourseEditorCourses_courses {
  __typename: "course"
  id: string
  slug: string
  name: string
  course_translation: CourseEditorCourses_courses_course_translation[]
  photo: CourseEditorCourses_courses_photo | null
}

export interface CourseEditorCourses {
  courses: CourseEditorCourses_courses[] | null
}
