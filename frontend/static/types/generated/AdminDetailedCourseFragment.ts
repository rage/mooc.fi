/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL fragment: AdminDetailedCourseFragment
// ====================================================

export interface AdminDetailedCourseFragment_photo {
  __typename: "Image"
  id: string
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string
  uncompressed_mimetype: string
}

export interface AdminDetailedCourseFragment_course_translations {
  __typename: "CourseTranslation"
  id: string
  name: string
  language: string
  description: string
  instructions: string | null
  link: string | null
}

export interface AdminDetailedCourseFragment_open_university_registration_links {
  __typename: "OpenUniversityRegistrationLink"
  id: string
  course_code: string
  language: string
  link: string | null
}

export interface AdminDetailedCourseFragment_study_modules {
  __typename: "StudyModule"
  id: string
}

export interface AdminDetailedCourseFragment_course_variants {
  __typename: "CourseVariant"
  id: string
  slug: string
  description: string | null
}

export interface AdminDetailedCourseFragment_course_aliases {
  __typename: "CourseAlias"
  id: string
  course_code: string
}

export interface AdminDetailedCourseFragment_inherit_settings_from {
  __typename: "Course"
  id: string
}

export interface AdminDetailedCourseFragment_completions_handled_by {
  __typename: "Course"
  id: string
}

export interface AdminDetailedCourseFragment_user_course_settings_visibilities {
  __typename: "UserCourseSettingsVisibility"
  id: string
  language: string
}

export interface AdminDetailedCourseFragment_course_tags_tag_tag_translations {
  __typename: "TagTranslation"
  language: string
  name: string
  description: string | null
}

export interface AdminDetailedCourseFragment_course_tags_tag {
  __typename: "Tag"
  id: string
  color: string | null
  tag_translations: AdminDetailedCourseFragment_course_tags_tag_tag_translations[]
}

export interface AdminDetailedCourseFragment_course_tags {
  __typename: "CourseTag"
  tag: AdminDetailedCourseFragment_course_tags_tag | null
}

export interface AdminDetailedCourseFragment {
  __typename: "Course"
  id: string
  name: string
  slug: string
  hidden: boolean | null
  ects: string | null
  order: number | null
  study_module_order: number | null
  teacher_in_charge_name: string
  teacher_in_charge_email: string
  support_email: string | null
  start_date: string
  end_date: string | null
  tier: number | null
  photo: AdminDetailedCourseFragment_photo | null
  promote: boolean | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  status: CourseStatus | null
  course_translations: AdminDetailedCourseFragment_course_translations[]
  open_university_registration_links: AdminDetailedCourseFragment_open_university_registration_links[]
  study_modules: AdminDetailedCourseFragment_study_modules[]
  course_variants: AdminDetailedCourseFragment_course_variants[]
  course_aliases: AdminDetailedCourseFragment_course_aliases[]
  inherit_settings_from: AdminDetailedCourseFragment_inherit_settings_from | null
  completions_handled_by: AdminDetailedCourseFragment_completions_handled_by | null
  has_certificate: boolean | null
  user_course_settings_visibilities: AdminDetailedCourseFragment_user_course_settings_visibilities[]
  upcoming_active_link: boolean | null
  automatic_completions: boolean | null
  automatic_completions_eligible_for_ects: boolean | null
  exercise_completions_needed: number | null
  points_needed: number | null
  course_tags: AdminDetailedCourseFragment_course_tags[]
}
