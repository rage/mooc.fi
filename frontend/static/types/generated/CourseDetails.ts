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
  id: any
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string
  uncompressed_mimetype: string
}

export interface CourseDetails_course_course_translations {
  __typename: "CourseTranslation"
  id: any
  name: string
  language: string
  description: string
  link: string | null
}

export interface CourseDetails_course_open_university_registration_links {
  __typename: "OpenUniversityRegistrationLink"
  id: any
  course_code: string
  language: string
  link: string | null
}

export interface CourseDetails_course_study_modules {
  __typename: "StudyModule"
  id: any
}

export interface CourseDetails_course_course_variants {
  __typename: "CourseVariant"
  id: any
  slug: string
  description: string | null
}

export interface CourseDetails_course_course_aliases {
  __typename: "CourseAlias"
  id: any
  course_code: string
}

export interface CourseDetails_course_inherit_settings_from {
  __typename: "Course"
  id: any
}

export interface CourseDetails_course_completions_handled_by {
  __typename: "Course"
  id: any
}

export interface CourseDetails_course {
  __typename: "Course"
  id: any
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
  course_translations: CourseDetails_course_course_translations[] | null
  open_university_registration_links:
    | CourseDetails_course_open_university_registration_links[]
    | null
  study_modules: CourseDetails_course_study_modules[] | null
  course_variants: CourseDetails_course_course_variants[] | null
  course_aliases: CourseDetails_course_course_aliases[] | null
  inherit_settings_from: CourseDetails_course_inherit_settings_from | null
  completions_handled_by: CourseDetails_course_completions_handled_by | null
}

export interface CourseDetails {
  course: CourseDetails_course | null
}

export interface CourseDetailsVariables {
  slug?: string | null
}
