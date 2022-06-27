import { AllCourses_courses } from "/static/types/generated/AllCourses"
import { AllModules_study_modules } from "/static/types/generated/AllModules"

/*
  DO NOT DELETE - this is not an auto-generated file!
*/

export interface AllModules_study_modules_with_courses
  extends AllModules_study_modules {
  courses: AllCourses_courses[]
}
