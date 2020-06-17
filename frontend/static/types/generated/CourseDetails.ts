/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { course_status } from "./globalTypes"

// ====================================================
// GraphQL query operation: CourseDetails
// ====================================================

export interface CourseDetails_course_photo {
  __typename: "image"
  id: string
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string
  uncompressed_mimetype: string
}

export interface CourseDetails_course_course_translation {
  __typename: "course_translation"
  id: string
  name: string
  language: string
  description: string
  link: string | null
}

export interface CourseDetails_course_open_university_registration_link {
  __typename: "open_university_registration_link"
  id: string
  course_code: string
  language: string
  link: string | null
}

export interface CourseDetails_course_study_module {
  __typename: "study_module"
  id: string
}

export interface CourseDetails_course_course_variant {
  __typename: "course_variant"
  id: string
  slug: string
  description: string | null
}

export interface CourseDetails_course_course_alias {
  __typename: "course_alias"
  id: string
  course_code: string
}

export interface CourseDetails_course_inherit_settings_from {
  __typename: "course"
  id: string
}

export interface CourseDetails_course_completions_handled_by {
  __typename: "course"
  id: string
}

export interface CourseDetails_course_user_course_settings_visibility {
  __typename: "user_course_settings_visibility"
  id: string
  language: string
}

export interface CourseDetails_course {
  __typename: "course"
  id: string
  name: string
  slug: string
  ects: string | null
  order: number | null
  study_module_order: number | null
  teacher_in_charge_name: string
  teacher_in_charge_email: string
  support_email: string | null
  start_date: string
  end_date: string | null
  photo: CourseDetails_course_photo | null
  promote: boolean | null
  start_point: boolean | null
  hidden: boolean | null
  study_module_start_point: boolean | null
  status: course_status | null
  course_translation: CourseDetails_course_course_translation[]
  open_university_registration_link: CourseDetails_course_open_university_registration_link[]
  study_module: CourseDetails_course_study_module[]
  course_variant: CourseDetails_course_course_variant[]
  course_alias: CourseDetails_course_course_alias[]
  inherit_settings_from: CourseDetails_course_inherit_settings_from | null
  completions_handled_by: CourseDetails_course_completions_handled_by | null
  has_certificate: boolean | null
  user_course_settings_visibility: CourseDetails_course_user_course_settings_visibility[]
}

export interface CourseDetails {
  course: CourseDetails_course | null
}

export interface CourseDetailsVariables {
  slug?: string | null
}
