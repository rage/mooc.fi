/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL query operation: AllCourses
// ====================================================

export interface AllCourses_courses_photo {
  __typename: "Image"
  id: any
  compressed: string | null
  uncompressed: string
}

export interface AllCourses_courses_course_translations {
  __typename: "CourseTranslation"
  id: any
  language: string
  name: string
  description: string
  link: string
}

export interface AllCourses_courses {
  __typename: "Course"
  id: any
  slug: string
  name: string
  order: number | null
  photo: AllCourses_courses_photo | null
  promote: boolean | null
  status: CourseStatus | null
  start_point: boolean | null
  hidden: boolean | null
  course_translations: AllCourses_courses_course_translations[] | null
}

export interface AllCourses {
  courses: AllCourses_courses[]
}
