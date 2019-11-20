import { CourseStatus } from "/static/types/globalTypes"
import { FormValues } from "../types"
import {
  CourseDetails_course_photo,
  // CourseDetails_course_open_university_registration_links,
} from "/static/types/generated/CourseDetails"

export interface CourseFormValues extends FormValues {
  id?: string | null
  name: string
  slug: string
  ects?: string
  photo?: string | CourseDetails_course_photo | null
  start_point: boolean
  promote: boolean
  hidden: boolean
  study_module_start_point: boolean
  status: CourseStatus
  course_translations: CourseTranslationFormValues[]
  open_university_registration_links?: OpenUniversityRegistrationValues[] | null
  study_modules?: { [key: string]: boolean } | null
  course_variants: CourseVariantFormValues[]
  thumbnail?: string | null
  new_photo?: File
  new_slug: string
  base64?: boolean
  order?: number
  study_module_order?: number
}

export interface CourseTranslationFormValues extends FormValues {
  id?: string
  language: string
  name: string
  description: string
  link?: string | null
  course?: string
  open_university_course_code?: string
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
