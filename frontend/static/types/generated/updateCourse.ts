/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CourseUpsertArg } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: updateCourse
// ====================================================

export interface updateCourse_updateCourse_photo {
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

export interface updateCourse_updateCourse_course_translation {
  __typename: "CourseTranslation"
  id: string
  language: string
  name: string
  description: string
  link: string | null
}

export interface updateCourse_updateCourse_open_university_registration_link {
  __typename: "OpenUniversityRegistrationLink"
  id: string
  course_code: string
  language: string
  link: string | null
}

export interface updateCourse_updateCourse_study_module {
  __typename: "StudyModule"
  id: string
}

export interface updateCourse_updateCourse_course_variant {
  __typename: "CourseVariant"
  id: string
  slug: string
  description: string | null
}

export interface updateCourse_updateCourse_course_alias {
  __typename: "CourseAlias"
  id: string
  course_code: string
}

export interface updateCourse_updateCourse_completion_email {
  __typename: "EmailTemplate"
  id: string
  name: string | null
  title: string | null
  txt_body: string | null
  html_body: string | null
}

export interface updateCourse_updateCourse_user_course_settings_visibility {
  __typename: "UserCourseSettingsVisibility"
  id: string
  language: string
}

export interface updateCourse_updateCourse {
  __typename: "Course"
  id: string
  slug: string
  ects: string | null
  name: string
  order: number | null
  study_module_order: number | null
  photo: updateCourse_updateCourse_photo | null
  course_translation: updateCourse_updateCourse_course_translation[]
  open_university_registration_link: updateCourse_updateCourse_open_university_registration_link[]
  study_module: updateCourse_updateCourse_study_module[]
  course_variant: updateCourse_updateCourse_course_variant[]
  course_alias: updateCourse_updateCourse_course_alias[]
  completion_email: updateCourse_updateCourse_completion_email | null
  user_course_settings_visibility: updateCourse_updateCourse_user_course_settings_visibility[]
}

export interface updateCourse {
  updateCourse: updateCourse_updateCourse | null
}

export interface updateCourseVariables {
  course: CourseUpsertArg
}
