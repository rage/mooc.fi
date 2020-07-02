/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL query operation: AllEditorCourses
// ====================================================

export interface AllEditorCourses_courses_photo {
  __typename: "Image"
  id: string
  compressed: string | null
  uncompressed: string
}

export interface AllEditorCourses_courses_course_translation {
  __typename: "CourseTranslation"
  id: string
  language: string
  name: string
}

export interface AllEditorCourses_courses_course_variant {
  __typename: "CourseVariant"
  id: string
  slug: string
  description: string | null
}

export interface AllEditorCourses_courses_course_alias {
  __typename: "CourseAlias"
  id: string
  course_code: string
}

export interface AllEditorCourses_courses_user_course_settings_visibility {
  __typename: "UserCourseSettingsVisibility"
  id: string
  language: string
}

export interface AllEditorCourses_courses {
  __typename: "Course"
  id: string
  name: string
  slug: string
  order: number | null
  status: CourseStatus | null
  hidden: boolean | null
  photo: AllEditorCourses_courses_photo | null
  course_translation: AllEditorCourses_courses_course_translation[]
  course_variant: AllEditorCourses_courses_course_variant[]
  course_alias: AllEditorCourses_courses_course_alias[]
  user_course_settings_visibility: AllEditorCourses_courses_user_course_settings_visibility[]
}

export interface AllEditorCourses_currentUser {
  __typename: "User"
  id: string
  administrator: boolean
}

export interface AllEditorCourses {
  courses: AllEditorCourses_courses[] | null
  currentUser: AllEditorCourses_currentUser | null
}
