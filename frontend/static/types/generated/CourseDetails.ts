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

export interface CourseDetails_course_course_translations {
  __typename: "CourseTranslation"
  id: string
  name: string
  language: string
  description: string
  instructions: string | null
  link: string | null
}

export interface CourseDetails_course_open_university_registration_links {
  __typename: "OpenUniversityRegistrationLink"
  id: string
  course_code: string
  language: string
  link: string | null
}

export interface CourseDetails_course_study_modules {
  __typename: "StudyModule"
  id: string
}

export interface CourseDetails_course_course_variants {
  __typename: "CourseVariant"
  id: string
  slug: string
  description: string | null
}

export interface CourseDetails_course_course_aliases {
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

export interface CourseDetails_course_user_course_settings_visibilities {
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
  tier: number | null
  photo: CourseDetails_course_photo | null
  promote: boolean | null
  start_point: boolean | null
  hidden: boolean | null
  study_module_start_point: boolean | null
  status: CourseStatus | null
  course_translations: CourseDetails_course_course_translations[]
  open_university_registration_links: CourseDetails_course_open_university_registration_links[]
  study_modules: CourseDetails_course_study_modules[]
  course_variants: CourseDetails_course_course_variants[]
  course_aliases: CourseDetails_course_course_aliases[]
  inherit_settings_from: CourseDetails_course_inherit_settings_from | null
  completions_handled_by: CourseDetails_course_completions_handled_by | null
  has_certificate: boolean | null
  user_course_settings_visibilities: CourseDetails_course_user_course_settings_visibilities[]
  upcoming_active_link: boolean | null
  automatic_completions: boolean | null
  automatic_completions_eligible_for_ects: boolean | null
  exercise_completions_needed: number | null
  points_needed: number | null
}

export interface CourseDetails {
  course: CourseDetails_course | null
}

export interface CourseDetailsVariables {
  slug?: string | null
}
