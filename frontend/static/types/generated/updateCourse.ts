/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import {
  CourseStatus,
  CourseTranslationWithIdInput,
  OpenUniversityRegistrationLinkWithIdInput,
} from "./globalTypes"

// ====================================================
// GraphQL mutation operation: updateCourse
// ====================================================

export interface updateCourse_updateCourse_photo {
  __typename: "Image"
  id: any
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
  id: any
  language: string
  name: string
  description: string
  link: string
}

export interface updateCourse_updateCourse_open_university_registration_links {
  __typename: "OpenUniversityRegistrationLink"
  id: any
  course_code: string
  language: string
  link: string | null
}

export interface updateCourse_updateCourse {
  __typename: "Course"
  id: any
  slug: string
  photo: updateCourse_updateCourse_photo | null
  course_translations: updateCourse_updateCourse_course_translations[] | null
  open_university_registration_links:
    | updateCourse_updateCourse_open_university_registration_links[]
    | null
}

export interface updateCourse {
  updateCourse: updateCourse_updateCourse
}

export interface updateCourseVariables {
  id?: string | null
  name?: string | null
  slug?: string | null
  photo?: string | null
  new_photo?: any | null
  base64?: boolean | null
  promote?: boolean | null
  start_point?: boolean | null
  hidden?: boolean | null
  status?: CourseStatus | null
  new_slug?: string | null
  course_translations?: CourseTranslationWithIdInput[] | null
  open_university_registration_links?:
    | OpenUniversityRegistrationLinkWithIdInput[]
    | null
}
