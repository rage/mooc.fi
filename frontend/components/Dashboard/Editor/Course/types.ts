import { CourseStatus } from "../../../../static/types/globalTypes"
import { FormValues } from "../types"
import {
  CourseDetails_course_photo,
  CourseDetails_course_study_modules,
} from "../../../../static/types/generated/CourseDetails"

export interface CourseFormValues extends FormValues {
  id?: string | null
  name: string
  slug: string
  photo: string | CourseDetails_course_photo | undefined
  start_point: boolean
  promote: boolean
  hidden: boolean
  status: CourseStatus
  course_translations: CourseTranslationFormValues[]
  open_university_registration_links?: OpenUniversityRegistrationValues[]
  study_modules?: string[] | CourseDetails_course_study_modules[] | null
  thumbnail?: string | null
  new_photo: undefined | File
  new_slug: string
  base64: boolean
  order?: number
}

export interface CourseTranslationFormValues extends FormValues {
  id?: string | undefined
  language: string | undefined
  name: string | undefined
  description: string | null | undefined
  link: string | undefined
  course?: string | undefined
  open_university_course_code?: string | undefined
}

export interface OpenUniversityRegistrationValues extends FormValues {
  id?: string | undefined
  course_code: string
  language: string
  course: string | undefined
  link?: string | undefined
}
