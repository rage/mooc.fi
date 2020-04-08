/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CourseArg } from "./globalTypes"

// ====================================================
// GraphQL mutation operation: addCourse
// ====================================================

export interface addCourse_addCourse_photo {
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

export interface addCourse_addCourse_course_translations {
  __typename: "CourseTranslation"
  id: any
  language: string
  name: string
  description: string
  link: string | null
}

export interface addCourse_addCourse_open_university_registration_links {
  __typename: "OpenUniversityRegistrationLink"
  id: any
  course_code: string
  language: string
  link: string | null
}

export interface addCourse_addCourse_study_modules {
  __typename: "StudyModule"
  id: any
}

export interface addCourse_addCourse_course_variants {
  __typename: "CourseVariant"
  id: any
  slug: string
  description: string | null
}

export interface addCourse_addCourse_course_aliases {
  __typename: "CourseAlias"
  id: any
  course_code: string
}

export interface addCourse_addCourse {
  __typename: "Course"
  id: any
  slug: string
  ects: string | null
  name: string
  order: number | null
  study_module_order: number | null
  photo: addCourse_addCourse_photo | null
  course_translations: addCourse_addCourse_course_translations[] | null
  open_university_registration_links:
    | addCourse_addCourse_open_university_registration_links[]
    | null
  study_modules: addCourse_addCourse_study_modules[] | null
  course_variants: addCourse_addCourse_course_variants[] | null
  course_aliases: addCourse_addCourse_course_aliases[] | null
}

export interface addCourse {
  addCourse: addCourse_addCourse
}

export interface addCourseVariables {
  course: CourseArg
}
