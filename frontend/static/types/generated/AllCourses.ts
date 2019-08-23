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

export interface AllCourses_courses {
  __typename: "Course"
  id: any
  name: string
  slug: string
  status: CourseStatus | null
  hidden: boolean | null
  photo: AllCourses_courses_photo | null
}

export interface AllCourses_currentUser {
  __typename: "User"
  id: any
  administrator: boolean
}

export interface AllCourses {
  courses: AllCourses_courses[]
  currentUser: AllCourses_currentUser | null
}
