/* tslint:disable */
/* eslint-disable */
// @generated
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

export interface CourseAliasCreateInput {
  course?: string | null
  course_code: string
}

export interface CourseAliasUpsertInput {
  course?: string | null
  course_code: string
  id?: string | null
}

export interface CourseCreateArg {
  automatic_completions?: boolean | null
  automatic_completions_eligible_for_ects?: boolean | null
  base64?: boolean | null
  completion_email?: string | null
  completions_handled_by?: string | null
  course_aliases?: CourseAliasCreateInput[] | null
  course_stats_email?: string | null
  course_tags?: CourseTagCreateOrUpsertWithoutCourseIdInput[] | null
  course_translations?: CourseTranslationCreateInput[] | null
  course_variants?: CourseVariantCreateInput[] | null
  ects?: string | null
  end_date?: string | null
  exercise_completions_needed?: number | null
  has_certificate?: boolean | null
  hidden?: boolean | null
  inherit_settings_from?: string | null
  name?: string | null
  new_photo?: any | null
  open_university_registration_links?:
    | OpenUniversityRegistrationLinkCreateInput[]
    | null
  order?: number | null
  photo?: string | null
  points_needed?: number | null
  promote?: boolean | null
  slug: string
  start_date: string
  start_point?: boolean | null
  status?: CourseStatus | null
  study_module_order?: number | null
  study_module_start_point?: boolean | null
  study_modules?: StudyModuleWhereUniqueInput[] | null
  support_email?: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  tier?: number | null
  upcoming_active_link?: boolean | null
  user_course_settings_visibilities?:
    | UserCourseSettingsVisibilityCreateInput[]
    | null
}

export interface CourseTagCreateOrUpsertWithoutCourseIdInput {
  tag_id: string
}

export interface CourseTranslationCreateInput {
  course?: string | null
  description: string
  instructions?: string | null
  language: string
  link?: string | null
  name: string
}

export interface CourseTranslationUpsertInput {
  course?: string | null
  description: string
  id?: string | null
  instructions?: string | null
  language: string
  link?: string | null
  name: string
}

export interface CourseUpsertArg {
  automatic_completions?: boolean | null
  automatic_completions_eligible_for_ects?: boolean | null
  base64?: boolean | null
  completion_email?: string | null
  completions_handled_by?: string | null
  course_aliases?: CourseAliasUpsertInput[] | null
  course_stats_email?: string | null
  course_tags?: CourseTagCreateOrUpsertWithoutCourseIdInput[] | null
  course_translations?: CourseTranslationUpsertInput[] | null
  course_variants?: CourseVariantUpsertInput[] | null
  delete_photo?: boolean | null
  ects?: string | null
  end_date?: string | null
  exercise_completions_needed?: number | null
  has_certificate?: boolean | null
  hidden?: boolean | null
  id?: string | null
  inherit_settings_from?: string | null
  name: string
  new_photo?: any | null
  new_slug?: string | null
  open_university_registration_links?:
    | OpenUniversityRegistrationLinkUpsertInput[]
    | null
  order?: number | null
  photo?: string | null
  points_needed?: number | null
  promote?: boolean | null
  slug: string
  start_date: string
  start_point?: boolean | null
  status?: CourseStatus | null
  study_module_order?: number | null
  study_module_start_point?: boolean | null
  study_modules?: StudyModuleWhereUniqueInput[] | null
  support_email?: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  tier?: number | null
  upcoming_active_link?: boolean | null
  user_course_settings_visibilities?:
    | UserCourseSettingsVisibilityUpsertInput[]
    | null
}

export interface CourseVariantCreateInput {
  course?: string | null
  description?: string | null
  instructions?: string | null
  slug: string
}

export interface CourseVariantUpsertInput {
  course?: string | null
  description?: string | null
  id?: string | null
  instructions?: string | null
  slug: string
}

export interface ManualCompletionArg {
  completion_date?: any | null
  grade?: string | null
  tier?: number | null
  user_id: string
}

export interface OpenUniversityRegistrationLinkCreateInput {
  course_code: string
  language: string
  link?: string | null
  start_date?: any | null
  stop_date?: any | null
  tiers?: any | null
}

export interface OpenUniversityRegistrationLinkUpsertInput {
  course_code: string
  id?: string | null
  language: string
  link?: string | null
  start_date?: any | null
  stop_date?: any | null
  tiers?: any | null
}

export interface StudyModuleCreateArg {
  image?: string | null
  name?: string | null
  order?: number | null
  slug: string
  study_module_translations?:
    | (StudyModuleTranslationUpsertInput | null)[]
    | null
}

export interface StudyModuleTranslationUpsertInput {
  description: string
  id?: string | null
  language: string
  name: string
  study_module?: string | null
}

export interface StudyModuleUpsertArg {
  id?: string | null
  image?: string | null
  name?: string | null
  new_slug?: string | null
  order?: number | null
  slug: string
  study_module_translations?:
    | (StudyModuleTranslationUpsertInput | null)[]
    | null
}

export interface StudyModuleWhereUniqueInput {
  id?: string | null
  slug?: string | null
}

export interface UserCourseSettingsVisibilityCreateInput {
  course?: string | null
  language: string
}

export interface UserCourseSettingsVisibilityUpsertInput {
  course?: string | null
  id?: string | null
  language: string
}

//==============================================================
// END Enums and Input Objects
//==============================================================
