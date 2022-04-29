/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL fragment: UserCourseFragment
// ====================================================

export interface UserCourseFragment_photo {
  __typename: "Image"
  id: string
  compressed: string | null
  uncompressed: string
}

export interface UserCourseFragment_study_modules {
  __typename: "StudyModule"
  id: string
  slug: string
}

export interface UserCourseFragment_course_translations {
  __typename: "CourseTranslation"
  id: string
  language: string
  name: string
}

export interface UserCourseFragment_user_course_settings_visibilities {
  __typename: "UserCourseSettingsVisibility"
  id: string
  language: string
}

export interface UserCourseFragment_course_tags_tag_tag_translations {
  __typename: "TagTranslation"
  language: string
  name: string
  description: string | null
}

export interface UserCourseFragment_course_tags_tag {
  __typename: "Tag"
  id: string
  color: string | null
  tag_translations: UserCourseFragment_course_tags_tag_tag_translations[]
}

export interface UserCourseFragment_course_tags {
  __typename: "CourseTag"
  tag: UserCourseFragment_course_tags_tag | null
}

export interface UserCourseFragment {
  __typename: "Course"
  id: string
  slug: string
  name: string
  order: number | null
  status: CourseStatus | null
  hidden: boolean | null
  study_module_order: number | null
  photo: UserCourseFragment_photo | null
  promote: boolean | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  description: string | null
  link: string | null
  upcoming_active_link: boolean | null
  study_modules: UserCourseFragment_study_modules[]
  course_translations: UserCourseFragment_course_translations[]
  user_course_settings_visibilities: UserCourseFragment_user_course_settings_visibilities[]
  course_tags: UserCourseFragment_course_tags[]
}
