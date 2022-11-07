import { DateTime } from "luxon"

import { FormValues } from "../types"

import {
  CourseStatus,
  ImageCoreFieldsFragment,
  OpenUniversityRegistrationLinkCoreFieldsFragment,
} from "/graphql/generated"

export interface CourseFormValues extends FormValues {
  id?: string | null
  name: string
  slug: string
  teacher_in_charge_name: string
  teacher_in_charge_email: string
  support_email?: string
  start_date: string | DateTime
  end_date?: string | DateTime
  ects?: string
  photo?: string | ImageCoreFieldsFragment | null
  start_point: boolean
  promote: boolean
  hidden: boolean
  study_module_start_point: boolean
  status: CourseStatus
  course_translations: CourseTranslationFormValues[]
  open_university_registration_links?:
    | OpenUniversityRegistrationLinkCoreFieldsFragment[]
    | null
  study_modules?: { [key: string]: boolean } | null
  course_variants: CourseVariantFormValues[]
  course_aliases: CourseAliasFormValues[]
  thumbnail?: string | null
  new_photo?: File | null
  new_slug: string
  base64?: boolean
  order?: number
  study_module_order?: number
  import_photo?: string
  delete_photo?: boolean
  inherit_settings_from?: string
  completions_handled_by?: string
  has_certificate: boolean
  user_course_settings_visibilities: UserCourseSettingsVisibilityFormValues[]
  upcoming_active_link?: boolean
  tier?: number
  automatic_completions?: boolean
  automatic_completions_eligible_for_ects?: boolean
  exercise_completions_needed?: number
  points_needed?: number
}

export interface CourseTranslationFormValues extends FormValues {
  id?: string
  language: string
  name: string
  description: string
  instructions?: string
  link?: string | null
  course?: string
  // open_university_course_code?: string
  open_university_course_link?: OpenUniversityRegistrationLinkCoreFieldsFragment
}

export interface OpenUniversityRegistrationValues extends FormValues {
  id?: string
  course_code: string
  language: string
  course: string | undefined
  link?: string
}

export interface CourseVariantFormValues extends FormValues {
  id?: string
  slug: string
  description?: string
  instructions?: string
  course?: string
}

export interface CourseAliasFormValues extends FormValues {
  id?: string
  course_code: string
}

export interface UserCourseSettingsVisibilityFormValues extends FormValues {
  id?: string
  language: string
  course?: string
}
