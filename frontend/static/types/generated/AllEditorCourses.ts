/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL query operation: AllEditorCourses
// ====================================================

export interface AllEditorCourses_courses_photo {
  __typename: "Image"
  id: any
  compressed: string | null
  uncompressed: string
}

export interface AllEditorCourses_courses_course_translations {
  __typename: "CourseTranslation"
  id: any
  language: string
  name: string
}

export interface AllEditorCourses_courses_course_variants {
  __typename: "CourseVariant"
  id: any
  slug: string
  description: string | null
}

export interface AllEditorCourses_courses {
  __typename: "Course"
  id: any
  name: string
  slug: string
  order: number | null
  status: CourseStatus | null
  hidden: boolean | null
  photo: AllEditorCourses_courses_photo | null
  course_translations: AllEditorCourses_courses_course_translations[] | null
  course_variants: AllEditorCourses_courses_course_variants[] | null
}

export interface AllEditorCourses_currentUser {
  __typename: "User"
  id: any
  administrator: boolean
}

export interface AllEditorCourses {
  courses: AllEditorCourses_courses[]
  currentUser: AllEditorCourses_currentUser | null
}
