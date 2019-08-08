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
  created_at?: any | null;
  description: string;
  id?: any | null;
  language: string;
  link: string;
  name: string;
  updated_at?: any | null;
}

export interface CourseTranslationWithIdInput {
  course?: string | null;
  description: string;
  id?: string | null;
  language: string;
  link: string;
  name: string;
}

export interface OpenUniversityRegistrationLinkCreateWithoutCourseInput {
  course_code: string;
  created_at?: any | null;
  id?: any | null;
  language: string;
  link?: string | null;
  updated_at?: any | null;
}

export interface OpenUniversityRegistrationLinkWithIdInput {
  course?: string | null;
  course_code: string;
  id?: string | null;
  language: string;
  link?: string | null;
}

export interface StudyModuleTranslationCreateWithoutStudy_moduleInput {
  created_at?: any | null;
  description: string;
  id?: any | null;
  language: string;
  name: string;
  updated_at?: any | null;
}

export interface StudyModuleTranslationWithIdInput {
  description: string;
  id?: string | null;
  language: string;
  name: string;
  study_module?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
