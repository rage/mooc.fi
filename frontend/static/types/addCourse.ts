/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CourseStatus, CourseTranslationCreateInput } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: addCourse
// ====================================================

export interface addCourse_addCourse_photo {
  __typename: "Image"
  id: any
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string
  uncompressed_mimetype: string
}

export interface addCourse_addCourse_course_translations {
  __typename: "CourseTranslation"
  id: any
  language: string
  name: string
  description: string
  link: string
}

export interface addCourse_addCourse {
  __typename: "Course"
  id: any
  slug: string
  photo: addCourse_addCourse_photo | null
  course_translations: addCourse_addCourse_course_translations[] | null
}

export interface addCourse {
  addCourse: addCourse_addCourse
}

export interface addCourseVariables {
  name?: string | null
  slug?: string | null
  photo?: string | null
  promote?: boolean | null
  start_point?: boolean | null
  hidden?: boolean | null
  status?: CourseStatus | null
  course_translations?: CourseTranslationCreateInput[] | null
}
