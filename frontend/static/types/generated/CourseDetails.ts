/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL query operation: CourseDetails
// ====================================================

export interface CourseDetails_course_photo {
  __typename: "Image"
  id: string
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string
  uncompressed_mimetype: string
}

export interface CourseDetails_course_course_translation {
  __typename: "CourseTranslation"
  id: string
  name: string
  language: string
  description: string
  link: string | null
}

export interface CourseDetails_course_open_university_registration_link {
  __typename: "OpenUniversityRegistrationLink"
  id: string
  course_code: string
  language: string
  link: string | null
}

export interface CourseDetails_course_study_module {
  __typename: "StudyModule"
  id: string
}

export interface CourseDetails_course_course_variant {
  __typename: "CourseVariant"
  id: string
  slug: string
  description: string | null
}

export interface CourseDetails_course_course_alias {
  __typename: "CourseAlias"
  id: string
  course_code: string
}

export interface CourseDetails_course_inherit_settings_from {
  __typename: "Course"
  id: string
}

export interface CourseDetails_course_completions_handled_by {
  __typename: "Course"
  id: string
}

export interface CourseDetails_course_user_course_settings_visibility {
  __typename: "UserCourseSettingsVisibility"
  id: string
  language: string
}

export interface CourseDetails_course {
  __typename: "Course"
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
  status: CourseStatus | null
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
