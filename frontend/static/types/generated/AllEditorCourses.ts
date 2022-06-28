/* tslint:disable */

/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.
import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL query operation: AllEditorCourses
// ====================================================

export interface AllEditorCourses_courses_completions_handled_by {
  __typename: "Course"
  id: string
}

export interface AllEditorCourses_courses_photo {
  __typename: "Image"
  id: string
  compressed: string | null
  uncompressed: string
}

export interface AllEditorCourses_courses_course_translations {
  __typename: "CourseTranslation"
  id: string
  language: string
  name: string
}

export interface AllEditorCourses_courses_course_variants {
  __typename: "CourseVariant"
  id: string
  slug: string
  description: string | null
}

export interface AllEditorCourses_courses_course_aliases {
  __typename: "CourseAlias"
  id: string
  course_code: string
}

export interface AllEditorCourses_courses_user_course_settings_visibilities {
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
  tier: number | null
  instructions: string | null
  completions_handled_by: AllEditorCourses_courses_completions_handled_by | null
  start_date: string
  end_date: string | null
  support_email: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  photo: AllEditorCourses_courses_photo | null
  course_translations: AllEditorCourses_courses_course_translations[]
  course_variants: AllEditorCourses_courses_course_variants[]
  course_aliases: AllEditorCourses_courses_course_aliases[]
  user_course_settings_visibilities: AllEditorCourses_courses_user_course_settings_visibilities[]
  upcoming_active_link: boolean | null
}

export interface AllEditorCourses_currentUser {
  __typename: "User"
  id: string
  administrator: boolean
}

export interface AllEditorCourses {
  courses: (AllEditorCourses_courses | null)[] | null
  currentUser: AllEditorCourses_currentUser | null
}

export interface AllEditorCoursesVariables {
  search?: string | null
  hidden?: boolean | null
  handledBy?: string | null
  status?: CourseStatus[] | null
}
