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

export enum OrganizationRole {
  OrganizationAdmin = "OrganizationAdmin",
  Student = "Student",
  Teacher = "Teacher",
}

export interface CourseTranslationCreateWithoutCourseInput {
  created_at?: any | null
  description: string
  id?: any | null
  language: string
  link?: string | null
  name: string
  updated_at?: any | null
}

export interface CourseTranslationWithIdInput {
  course?: string | null
  description: string
  id?: string | null
  language: string
  link?: string | null
  name: string
}

export interface OpenUniversityRegistrationLinkCreateWithoutCourseInput {
  course_code: string
  created_at?: any | null
  id?: any | null
  language: string
  link?: string | null
  start_date?: any | null
  stop_date?: any | null
  updated_at?: any | null
}

export interface OpenUniversityRegistrationLinkWithIdInput {
  course?: string | null
  course_code: string
  id?: string | null
  language: string
  link?: string | null
}

export interface StudyModuleTranslationCreateWithoutStudy_moduleInput {
  created_at?: any | null
  description: string
  id?: any | null
  language: string
  name: string
  updated_at?: any | null
}

export interface StudyModuleTranslationWithIdInput {
  description: string
  id?: string | null
  language: string
  name: string
  study_module?: string | null
}

export interface StudyModuleWhereUniqueInput {
  id?: any | null
  slug?: string | null
}

//==============================================================
// END Enums and Input Objects
//==============================================================
