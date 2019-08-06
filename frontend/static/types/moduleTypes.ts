/*
  DO NOT DELETE - this is not an auto-generated file!
*/

import {
  AllModules_study_modules_courses_photo,
  AllModules_study_modules_courses_course_translations,
  AllModules_study_modules_courses,
  AllModules_study_modules_study_module_translations,
  AllModules_study_modules,
} from "/static/types/generated/AllModules"
import {
  AllCourses_courses_course_translations,
  AllCourses_courses,
} from "/static/types/generated/AllCourses"

export interface Module {
  name: string
  image: string
  id: string
  description: string
  courses: ModuleCourse[]
}

export interface ModuleCourse {
  name: string
  description: string
  id: string
  link: string
  photo: AllModules_study_modules_courses_photo
  promote: boolean
  slug: string
  start_point: boolean
  hidden: boolean
  status: string
}
export interface ObjectifiedCourseTranslations {
  [language: string]:
    | AllCourses_courses_course_translations
    | AllModules_study_modules_courses_course_translations
}

export interface ObjectifiedModuleCourse
  extends Omit<AllModules_study_modules_courses, "course_translations"> {
  course_translations:
    | ObjectifiedCourseTranslations
    | AllModules_study_modules_courses_course_translations[]
    | null
  link?: string
  description?: string
}

export interface ObjectifiedCourse
  extends Omit<AllCourses_courses, "course_translations"> {
  course_translations:
    | ObjectifiedCourseTranslations
    | AllCourses_courses_course_translations[]
    | null
  link?: string
  description?: string
}

export interface ObjectifiedModuleTranslations {
  [language: string]: AllModules_study_modules_study_module_translations
}

export interface ObjectifiedModule
  extends Omit<
    AllModules_study_modules,
    "name" | "study_module_translations" | "courses"
  > {
  study_module_translations:
    | ObjectifiedModuleTranslations
    | AllModules_study_modules_study_module_translations[]
    | null
  courses: ObjectifiedModuleCourse[] | null
  name?: string
  image?: string
  description?: string
}
