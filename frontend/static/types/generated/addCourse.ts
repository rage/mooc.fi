/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CourseCreateArg } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: addCourse
// ====================================================

export interface addCourse_addCourse_photo {
  __typename: "Image"
  id: string
  name: string | null
  original: string
  original_mimetype: string
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string
  uncompressed_mimetype: string
}

export interface addCourse_addCourse_course_translation {
  __typename: "CourseTranslation"
  id: string
  language: string
  name: string
  description: string
  link: string | null
}

export interface addCourse_addCourse_open_university_registration_link {
  __typename: "OpenUniversityRegistrationLink"
  id: string
  course_code: string
  language: string
  link: string | null
}

export interface addCourse_addCourse_study_module {
  __typename: "StudyModule"
  id: string
}

export interface addCourse_addCourse_course_variant {
  __typename: "CourseVariant"
  id: string
  slug: string
  description: string | null
}

export interface addCourse_addCourse_course_alias {
  __typename: "CourseAlias"
  id: string
  course_code: string
}

export interface addCourse_addCourse_user_course_settings_visibility {
  __typename: "UserCourseSettingsVisibility"
  id: string
  language: string
}

export interface addCourse_addCourse {
  __typename: "Course"
  id: string
  slug: string
  ects: string | null
  name: string
  order: number | null
  study_module_order: number | null
  photo: addCourse_addCourse_photo | null
  course_translation: addCourse_addCourse_course_translation[]
  open_university_registration_link: addCourse_addCourse_open_university_registration_link[]
  study_module: addCourse_addCourse_study_module[]
  course_variant: addCourse_addCourse_course_variant[]
  course_alias: addCourse_addCourse_course_alias[]
  user_course_settings_visibility: addCourse_addCourse_user_course_settings_visibility[]
}

export interface addCourse {
  addCourse: addCourse_addCourse | null
}

export interface addCourseVariables {
  course: CourseCreateArg
}
