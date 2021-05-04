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

export interface updateCourse_updateCourse_course_translations {
  __typename: "CourseTranslation"
  id: string
  language: string
  name: string
  description: string
  link: string | null
}

export interface updateCourse_updateCourse_open_university_registration_links {
  __typename: "OpenUniversityRegistrationLink"
  id: string
  course_code: string
  language: string
  link: string | null
}

export interface updateCourse_updateCourse_study_modules {
  __typename: "StudyModule"
  id: string
}

export interface updateCourse_updateCourse_course_variants {
  __typename: "CourseVariant"
  id: string
  slug: string
  description: string | null
}

export interface updateCourse_updateCourse_course_aliases {
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

export interface updateCourse_updateCourse_user_course_settings_visibilities {
  __typename: "UserCourseSettingsVisibility"
  id: string
  language: string
}

export interface updateCourse_updateCourse_course_stats_email {
  __typename: "EmailTemplate"
  id: string
  name: string | null
  title: string | null
  txt_body: string | null
  html_body: string | null
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
  course_translations: updateCourse_updateCourse_course_translations[]
  open_university_registration_links: updateCourse_updateCourse_open_university_registration_links[]
  study_modules: updateCourse_updateCourse_study_modules[]
  course_variants: updateCourse_updateCourse_course_variants[]
  course_aliases: updateCourse_updateCourse_course_aliases[]
  completion_email: updateCourse_updateCourse_completion_email | null
  user_course_settings_visibilities: updateCourse_updateCourse_user_course_settings_visibilities[]
}

export interface updateCourse {
  updateCourse: updateCourse_updateCourse | null
}

export interface updateCourseVariables {
  course: CourseUpsertArg
}
