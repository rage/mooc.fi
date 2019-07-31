import { AllModules_study_modules_courses_photo } from "./AllModules"

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
