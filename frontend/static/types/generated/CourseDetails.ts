/* tslint:disable */
/* eslint-disable */
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
  link: string
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

export interface CourseDetails_course {
  __typename: "Course"
  id: any
  name: string
  slug: string
  order: number | null
  photo: CourseDetails_course_photo | null
  promote: boolean | null
  start_point: boolean | null
  hidden: boolean | null
  status: CourseStatus | null
  course_translations: CourseDetails_course_course_translations[] | null
  open_university_registration_links:
    | CourseDetails_course_open_university_registration_links[]
    | null
  study_modules: CourseDetails_course_study_modules[] | null
}

export interface CourseDetails {
  course: CourseDetails_course
}

export interface CourseDetailsVariables {
  slug?: string | null
}
