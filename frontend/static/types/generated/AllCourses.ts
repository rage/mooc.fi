/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { course_status } from "./globalTypes"

// ====================================================
// GraphQL query operation: AllCourses
// ====================================================

export interface AllCourses_courses_photo {
  __typename: "image"
  id: string
  compressed: string | null
  uncompressed: string
}

export interface AllCourses_courses_study_module {
  __typename: "study_module"
  id: string
}

export interface AllCourses_courses_course_translation {
  __typename: "course_translation"
  id: string
  language: string
  name: string
}

export interface AllCourses_courses_user_course_settings_visibility {
  __typename: "user_course_settings_visibility"
  id: string
  language: string
}

export interface AllCourses_courses {
  __typename: "course"
  id: string
  slug: string
  name: string
  order: number | null
  photo: AllCourses_courses_photo | null
  promote: boolean | null
  status: course_status | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  hidden: boolean | null
  description: string | null
  link: string | null
  study_module: AllCourses_courses_study_module[]
  course_translation: AllCourses_courses_course_translation[]
  user_course_settings_visibility: AllCourses_courses_user_course_settings_visibility[]
}

export interface AllCourses {
  courses: AllCourses_courses[] | null
}

export interface AllCoursesVariables {
  language?: string | null
}
