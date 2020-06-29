/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum course_status {
  Active = "Active",
  Ended = "Ended",
  Upcoming = "Upcoming",
}

export enum organization_role {
  OrganizationAdmin = "OrganizationAdmin",
  Student = "Student",
  Teacher = "Teacher",
}

export interface CourseCreateArg {
  automatic_completions?: boolean | null
  automatic_completions_eligible_for_ects?: boolean | null
  base64?: boolean | null
  completion_email?: string | null
  completions_handled_by?: string | null
  course_alias?: course_aliasCreateInput[] | null
  course_translation?: course_translationCreateInput[] | null
  course_variant?: course_variantCreateInput[] | null
  ects?: string | null
  end_date?: string | null
  has_certificate?: boolean | null
  hidden?: boolean | null
  inherit_settings_from?: string | null
  name?: string | null
  new_photo?: any | null
  open_university_registration_link?:
    | open_university_registration_linkCreateInput[]
    | null
  order?: number | null
  photo?: string | null
  points_needed?: number | null
  promote?: boolean | null
  slug: string
  start_date: string
  start_point?: boolean | null
  status?: course_status | null
  study_module?: study_moduleWhereUniqueInput[] | null
  study_module_order?: number | null
  study_module_start_point?: boolean | null
  support_email?: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  user_course_settings_visibility?:
    | user_course_settings_visibilityCreateInput[]
    | null
}

export interface CourseUpsertArg {
  automatic_completions?: boolean | null
  automatic_completions_eligible_for_ects?: boolean | null
  base64?: boolean | null
  completion_email?: string | null
  completions_handled_by?: string | null
  course_alias?: course_aliasUpsertInput[] | null
  course_translation?: course_translationUpsertInput[] | null
  course_variant?: course_variantUpsertInput[] | null
  delete_photo?: boolean | null
  ects?: string | null
  end_date?: string | null
  has_certificate?: boolean | null
  hidden?: boolean | null
  id?: string | null
  inherit_settings_from?: string | null
  name: string
  new_photo?: any | null
  new_slug?: string | null
  open_university_registration_link?:
    | open_university_registration_linkUpsertInput[]
    | null
  order?: number | null
  photo?: string | null
  points_needed?: number | null
  promote?: boolean | null
  slug: string
  start_date: string
  start_point?: boolean | null
  status?: course_status | null
  study_module?: study_moduleWhereUniqueInput[] | null
  study_module_order?: number | null
  study_module_start_point?: boolean | null
  support_email?: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  user_course_settings_visibility?:
    | user_course_settings_visibilityUpsertInput[]
    | null
}

export interface ManualCompletionArg {
  grade?: string | null
  user_id: string
}

export interface StudyModuleCreateArg {
  image?: string | null
  name?: string | null
  order?: number | null
  slug: string
  study_module_translation?: study_module_translationUpsertInput[] | null
}

export interface StudyModuleUpsertArg {
  id?: string | null
  image?: string | null
  name?: string | null
  new_slug?: string | null
  order?: number | null
  slug: string
  study_module_translation?: study_module_translationUpsertInput[] | null
}

export interface course_aliasCreateInput {
  course?: string | null
  course_code: string
}

export interface course_aliasUpsertInput {
  course?: string | null
  course_code: string
  id?: string | null
}

export interface course_translationCreateInput {
  course?: string | null
  description: string
  language: string
  link?: string | null
  name: string
}

export interface course_translationUpsertInput {
  course?: string | null
  description: string
  id?: string | null
  language: string
  link?: string | null
  name: string
}

export interface course_variantCreateInput {
  course?: string | null
  description?: string | null
  slug: string
}

export interface course_variantUpsertInput {
  course?: string | null
  description?: string | null
  id?: string | null
  slug: string
}

export interface open_university_registration_linkCreateInput {
  course_code: string
  language: string
  link?: string | null
  start_date?: any | null
  stop_date?: any | null
}

export interface open_university_registration_linkUpsertInput {
  course_code: string
  id?: string | null
  language: string
  link?: string | null
  start_date?: any | null
  stop_date?: any | null
}

export interface study_moduleWhereUniqueInput {
  id?: string | null
  slug?: string | null
}

export interface study_module_translationUpsertInput {
  description: string
  id?: string | null
  language: string
  name: string
  study_module?: string | null
}

export interface user_course_settings_visibilityCreateInput {
  course?: string | null
  language: string
}

export interface user_course_settings_visibilityUpsertInput {
  course?: string | null
  id?: string | null
  language: string
}

//==============================================================
// END Enums and Input Objects
//==============================================================
