/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CourseStatus } from "./globalTypes"

// ====================================================
// GraphQL query operation: AllModules
// ====================================================

export interface AllModules_study_modules_courses_photo {
  __typename: "Image"
  id: any
  compressed: string | null
  uncompressed: string
}

export interface AllModules_study_modules_courses_course_translations {
  __typename: "CourseTranslation"
  id: any
  language: string
  name: string
  description: string
  link: string
}

export interface AllModules_study_modules_courses {
  __typename: "Course"
  id: any
  slug: string
  photo: AllModules_study_modules_courses_photo | null
  promote: boolean | null
  status: CourseStatus | null
  start_point: boolean | null
  course_translations:
    | AllModules_study_modules_courses_course_translations[]
    | null
}

export interface AllModules_study_modules_study_module_translations {
  __typename: "StudyModuleTranslation"
  id: any
  language: string
  name: string
  description: string
}

export interface AllModules_study_modules {
  __typename: "StudyModule"
  id: any
  courses: AllModules_study_modules_courses[] | null
  study_module_translations:
    | AllModules_study_modules_study_module_translations[]
    | null
}

export interface AllModules {
  study_modules: AllModules_study_modules[]
}
