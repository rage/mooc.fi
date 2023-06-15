import { FormValues } from "../types"

export interface StudyModuleFormValues extends FormValues {
  id?: string | null
  slug: string
  new_slug: string
  name: string
  image: string
  order?: number
  // courses: any[]
  study_module_translations?: StudyModuleTranslationFormValues[]
}

export interface StudyModuleTranslationFormValues extends FormValues {
  _id?: string
  name: string
  language: string
  description: string
}
