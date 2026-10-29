import { CourseStatus } from "/graphql/generated"

export interface ImageCoreFields {
  id: string
  name: string | null
  original: string
  original_mimetype: string
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string
  uncompressed_mimetype: string
  created_at: string
  updated_at: string
}

export interface CourseTranslationCoreFields {
  id: string
  language: string
  name: string
  description: string
}

export interface StudyModuleCoreFields {
  id: string
  slug: string
  name: string
}

export interface TagTranslationFields {
  tag_id: string
  name: string
  description: string | null
  language: string
  abbreviation: string | null
}

export interface TagCoreFields {
  id: string
  hidden: boolean
  types: Array<string>
  name: string | null
  abbreviation: string | null
  tag_translations: Array<TagTranslationFields>
}

export type CourseTagFields = Omit<TagCoreFields, "tag_translations">

export interface SponsorImageFields {
  type: string
  width: number
  height: number
  uri: string
}

export interface CourseSponsorFields {
  id: string
  name: string
  order: number
  images: Array<SponsorImageFields>
}

export interface NewFrontpageCourseFields {
  id: string
  slug: string
  name: string
  ects: string | null
  language: string | null
  created_at: string
  updated_at: string
  description: string
  link: string
  order: number | null
  study_module_order: number | null
  promote: boolean | null
  status: CourseStatus | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  hidden: boolean | null
  upcoming_active_link: boolean | null
  tier: number | null
  support_email: string | null
  teacher_in_charge_email: string
  teacher_in_charge_name: string
  start_date: string | null
  end_date: string | null
  has_certificate: boolean | null
  photo: ImageCoreFields | null
}

export interface NewCourseFields extends NewFrontpageCourseFields {
  study_modules: Array<StudyModuleCoreFields>
  course_translations: Array<CourseTranslationCoreFields>
  tags: Array<CourseTagFields>
  sponsors: Array<CourseSponsorFields>
}

export interface StudyModuleFields {
  id: string
  slug: string
  name: string
  description: string
  image: string | null
  order: number | null
  created_at: string
  updated_at: string
}

export interface StudyModuleFieldsWithCourses extends StudyModuleFields {
  courses: Array<Omit<NewCourseFields, "study_modules">>
}

export interface FrontpageResponse {
  study_modules: Array<StudyModuleFields>
}

export interface CoursesResponse {
  courses: Array<NewCourseFields>
  tags: Array<TagCoreFields>
}

export interface StudyModulesResponse {
  study_modules: Array<StudyModuleFieldsWithCourses>
}
