import {
  CourseStatus,
  OpenUniversityRegistrationLinkWithIdInput,
} from "../../../static/types/globalTypes"

export interface CourseFormValues {
  id?: string | null
  name: string
  slug: string
  photo: any
  start_point: boolean
  promote: boolean
  hidden: boolean
  status: CourseStatus
  course_translations: CourseTranslationFormValues[]
  open_university_registration_links?: OpenUniversityRegistrationValues[]
  study_module: string | null | undefined
  thumbnail?: string
  new_photo: undefined | File
  new_slug: string
}

export interface CourseTranslationFormValues {
  id?: string | undefined
  language: string | undefined
  name: string | undefined
  description: string | null | undefined
  link: string | undefined
  course?: string | undefined
  open_university_course_code?: string | undefined
}

export interface OpenUniversityRegistrationValues {
  id?: string | undefined
  course_code: string
  language: string
  course: string | undefined
  link?: string | undefined
}
