/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL fragment: AdminCourseFragment
// ====================================================

export interface AdminCourseFragment_completions_handled_by {
  __typename: "Course"
  id: string
}

export interface AdminCourseFragment_photo {
  __typename: "Image"
  id: string
  compressed: string | null
  uncompressed: string
}

export interface AdminCourseFragment_course_translations {
  __typename: "CourseTranslation"
  id: string
  language: string
  name: string
}

export interface AdminCourseFragment_course_variants {
  __typename: "CourseVariant"
  id: string
  slug: string
  description: string | null
}

export interface AdminCourseFragment_course_aliases {
  __typename: "CourseAlias"
  id: string
  course_code: string
}

export interface AdminCourseFragment_user_course_settings_visibilities {
  __typename: "UserCourseSettingsVisibility"
  id: string
  language: string
}

export interface AdminCourseFragment_course_tags_tag_tag_translations {
  __typename: "TagTranslation"
  language: string
  name: string
  description: string | null
}

export interface AdminCourseFragment_course_tags_tag {
  __typename: "Tag"
  id: string
  color: string | null
  tag_translations: AdminCourseFragment_course_tags_tag_tag_translations[]
}

export interface AdminCourseFragment_course_tags {
  __typename: "CourseTag"
  tag: AdminCourseFragment_course_tags_tag | null
}

export interface AdminCourseFragment {
  __typename: "Course"
  id: string
  name: string
  slug: string
  order: number | null
  status: CourseStatus | null
  hidden: boolean | null
  tier: number | null
  instructions: string | null
  completions_handled_by: AdminCourseFragment_completions_handled_by | null
  start_date: string
  end_date: string | null
  support_email: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  photo: AdminCourseFragment_photo | null
  course_translations: AdminCourseFragment_course_translations[]
  course_variants: AdminCourseFragment_course_variants[]
  course_aliases: AdminCourseFragment_course_aliases[]
  user_course_settings_visibilities: AdminCourseFragment_user_course_settings_visibilities[]
  upcoming_active_link: boolean | null
  course_tags: AdminCourseFragment_course_tags[]
}
