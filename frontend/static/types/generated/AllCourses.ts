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
  id: string
  compressed: string | null
  uncompressed: string
}

export interface AllCourses_courses_study_modules {
  __typename: "StudyModule"
  id: string
  slug: string
}

export interface AllCourses_courses_course_translations {
  __typename: "CourseTranslation"
  id: string
  language: string
  name: string
}

export interface AllCourses_courses_user_course_settings_visibilities {
  __typename: "UserCourseSettingsVisibility"
  id: string
  language: string
}

export interface AllCourses_courses {
  __typename: "Course"
  id: string
  slug: string
  name: string
  order: number | null
  study_module_order: number | null
  photo: AllCourses_courses_photo | null
  promote: boolean | null
  status: CourseStatus | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  hidden: boolean | null
  description: string | null
  link: string | null
  upcoming_active_link: boolean | null
  study_modules: AllCourses_courses_study_modules[]
  course_translations: AllCourses_courses_course_translations[]
  user_course_settings_visibilities: AllCourses_courses_user_course_settings_visibilities[]
}

export interface AllCourses {
  courses: (AllCourses_courses | null)[] | null
}

export interface AllCoursesVariables {
  language?: string | null
}
