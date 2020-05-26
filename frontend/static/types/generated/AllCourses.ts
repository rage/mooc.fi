/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL query operation: AllCourses
// ====================================================

export interface AllCourses_courses_photo {
  __typename: "Image"
  id: any
  compressed: string | null
  uncompressed: string
}

export interface AllCourses_courses_study_modules {
  __typename: "StudyModule"
  id: any
}

export interface AllCourses_courses_course_translations {
  __typename: "CourseTranslation"
  id: any
  language: string
  name: string
}

export interface AllCourses_courses_user_course_settings_visibility {
  __typename: "UserCourseSettingsVisibility"
  visible: boolean
}

export interface AllCourses_courses {
  __typename: "Course"
  id: any
  slug: string
  name: string
  order: number | null
  photo: AllCourses_courses_photo | null
  promote: boolean | null
  status: CourseStatus | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  hidden: boolean | null
  description: string
  link: string
  study_modules: AllCourses_courses_study_modules[] | null
  course_translations: AllCourses_courses_course_translations[] | null
  user_course_settings_visibility: AllCourses_courses_user_course_settings_visibility | null
}

export interface AllCourses {
  courses: AllCourses_courses[]
}

export interface AllCoursesVariables {
  language?: string | null
}
