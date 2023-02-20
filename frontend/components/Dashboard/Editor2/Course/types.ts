import { DateTime } from "luxon"
import { FieldValues } from "react-hook-form"

import {
  CourseStatus,
  ImageCoreFieldsFragment,
  TagCoreFieldsFragment,
} from "/graphql/generated"

interface FormValues extends FieldValues {
  id?: string | null
}

export interface CourseFormValues extends FormValues {
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
  open_university_registration_links?: OpenUniversityRegistrationValues[] | null
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
  tags: TagFormValue[]
}

export interface CourseTranslationFormValues extends FormValues {
  _id?: string
  language: string
  name: string
  description: string
  instructions?: string
  link?: string | null
  course?: string
  // open_university_course_code?: string
  open_university_course_link?: OpenUniversityRegistrationValues
}

export interface OpenUniversityRegistrationValues extends FormValues {
  _id?: string
  course_code: string
  language?: string
  //  course: string | undefined
  link?: string | null
}

export interface CourseVariantFormValues extends FormValues {
  _id?: string
  slug: string
  description?: string
  instructions?: string
  course?: string
}

export interface CourseAliasFormValues extends FormValues {
  _id?: string
  course_code: string
}

export interface UserCourseSettingsVisibilityFormValues extends FormValues {
  _id?: string
  language: string
  course?: string
}

export interface TagFormValue extends FormValues {
  _id?: string
  types?: string[]
  tag_translations: TagTranslationFormValues[]
}

export interface TagTranslationFormValues extends FormValues {
  _id?: string
  language: string
  name: string
  description?: string
}

export interface TagTypeFormValues extends FormValues {
  _id?: string
  name: string
}

export type TagOptionValue = Omit<
  TagCoreFieldsFragment,
  "__typename" | "id"
> & { _id: string }
