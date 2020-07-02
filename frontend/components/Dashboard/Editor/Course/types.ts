import { CourseStatus } from "/static/types/generated/globalTypes"
import { FormValues } from "../types"
import {
  CourseDetails_course_photo,
  CourseDetails_course_open_university_registration_link,
  // CourseDetails_course_open_university_registration_links,
} from "/static/types/generated/CourseDetails"
import { DateTime } from "luxon"

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
  photo?: string | CourseDetails_course_photo | null
  start_point: boolean
  promote: boolean
  hidden: boolean
  study_module_start_point: boolean
  status: CourseStatus
  course_translation: CourseTranslationFormValues[]
  open_university_registration_link?:
    | CourseDetails_course_open_university_registration_link[]
    | null
  study_module?: { [key: string]: boolean } | null
  course_variant: CourseVariantFormValues[]
  course_alias: CourseAliasFormValues[]
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
  user_course_settings_visibility: UserCourseSettingsVisibilityFormValues[]
}

export interface CourseTranslationFormValues extends FormValues {
  id?: string
  language: string
  name: string
  description: string
  link?: string | null
  course?: string
  // open_university_course_code?: string
  open_university_course_link?: CourseDetails_course_open_university_registration_link
}

export interface OpenUniversityRegistrationValues extends FormValues {
  id?: string
  course_code: string
  language: string
  course: string | undefined
  link?: string | undefined
}

export interface CourseVariantFormValues extends FormValues {
  id?: string
  slug: string
  description?: string
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
