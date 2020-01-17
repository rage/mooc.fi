/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CourseArg } from "./globalTypes"

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
  link: string | null
}

export interface updateCourse_updateCourse_open_university_registration_links {
  __typename: "OpenUniversityRegistrationLink"
  id: any
  course_code: string
  language: string
  link: string | null
}

export interface updateCourse_updateCourse_study_modules {
  __typename: "StudyModule"
  id: any
}

export interface updateCourse_updateCourse_course_variants {
  __typename: "CourseVariant"
  id: any
  slug: string
  description: string | null
}

export interface updateCourse_updateCourse_completion_email {
  __typename: "EmailTemplate"
  id: any
  name: string | null
  title: string | null
  txt_body: string | null
  html_body: string | null
}

export interface updateCourse_updateCourse {
  __typename: "Course"
  id: any
  slug: string
  ects: string | null
  name: string
  order: number | null
  study_module_order: number | null
  photo: updateCourse_updateCourse_photo | null
  course_translations: updateCourse_updateCourse_course_translations[] | null
  open_university_registration_links:
    | updateCourse_updateCourse_open_university_registration_links[]
    | null
  study_modules: updateCourse_updateCourse_study_modules[] | null
  course_variants: updateCourse_updateCourse_course_variants[] | null
  completion_email: updateCourse_updateCourse_completion_email | null
}

export interface updateCourse {
  updateCourse: updateCourse_updateCourse
}

export interface updateCourseVariables {
  course: CourseArg
}
