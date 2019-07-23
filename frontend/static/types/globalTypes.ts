/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CourseStatus {
  Active = "Active",
  Ended = "Ended",
  Upcoming = "Upcoming",
}

export interface CourseTranslationCreateWithoutCourseInput {
  created_at?: any | null
  description: string
  id?: any | null
  language: string
  link: string
  name: string
  updated_at?: any | null
}

export interface CourseTranslationWithIdInput {
  course?: string | null
  description: string
  id?: string | null
  language: string
  link: string
  name: string
}

//==============================================================
// END Enums and Input Objects
//==============================================================
