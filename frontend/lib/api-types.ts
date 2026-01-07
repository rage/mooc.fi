export interface ImageCoreFields {
  id: string
  name: string | null
  original: string | null
  original_mimetype: string | null
  compressed: string | null
  compressed_mimetype: string | null
  uncompressed: string | null
  uncompressed_mimetype: string | null
  created_at: string
  updated_at: string
}

export interface CourseTranslationCoreFields {
  id: string
  language: string
  name: string
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
  types: Array<string> | null
  name: string | null
  abbreviation: string | null
  tag_translations: Array<TagTranslationFields>
}

export interface SponsorTranslationFields {
  sponsor_id: string
  language: string
  name: string
  description: string | null
  link: string | null
  link_text: string | null
}

export interface SponsorImageFields {
  sponsor_id: string
  type: string | null
  width: number | null
  height: number | null
  uri: string | null
}

export interface CourseSponsorFields {
  id: string
  name: string
  order: number
  translations: Array<SponsorTranslationFields>
  images: Array<SponsorImageFields>
}

export interface NewFrontpageCourseFields {
  id: string
  slug: string
  name: string
  ects: number | null
  language: string | null
  created_at: string
  updated_at: string
  description: string
  link: string
  order: number | null
  study_module_order: number | null
  promote: boolean | null
  status: string | null
  start_point: boolean | null
  study_module_start_point: boolean | null
  hidden: boolean | null
  upcoming_active_link: string | null
  tier: number | null
  support_email: string | null
  teacher_in_charge_email: string | null
  teacher_in_charge_name: string | null
  start_date: string | null
  end_date: string | null
  has_certificate: boolean | null
  photo: ImageCoreFields | null
  study_modules: Array<StudyModuleCoreFields>
}

export interface NewCourseFields extends NewFrontpageCourseFields {
  course_translations: Array<CourseTranslationCoreFields>
  tags: Array<TagCoreFields>
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
  courses: Array<NewCourseFields>
}

export interface FrontpageResponse {
  courses: Array<NewCourseFields>
  study_modules: Array<StudyModuleFields>
}

export interface CoursesResponse {
  courses: Array<NewCourseFields>
  tags: Array<TagCoreFields>
}

export interface StudyModulesResponse {
  study_modules: Array<StudyModuleFieldsWithCourses>
}

export interface CurrentUserResponse {
  currentUser: {
    id: string
    upstream_id: number
    first_name: string | null
    last_name: string | null
    full_name: string | null
    username: string
    email: string
    student_number: string | null
    real_student_number: string | null
    created_at: string
    updated_at: string
  } | null
}
