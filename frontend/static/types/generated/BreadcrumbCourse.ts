/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BreadcrumbCourse
// ====================================================

export interface BreadcrumbCourse_course_course_translation {
  __typename: "CourseTranslation"
  id: string
  language: string
  name: string
}

export interface BreadcrumbCourse_course {
  __typename: "Course"
  id: string
  slug: string
  name: string
  course_translation: BreadcrumbCourse_course_course_translation[]
}

export interface BreadcrumbCourse {
  course: BreadcrumbCourse_course | null
}

export interface BreadcrumbCourseVariables {
  slug?: string | null
}
