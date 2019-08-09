import { FormValues } from "/components/Dashboard/Editor/types"

export interface StudyModuleFormValues extends FormValues {
  id?: string | null
  slug: string
  new_slug: string
  name: string
  image: string
  order?: number
  // courses: any[]
  study_module_translations: StudyModuleTranslationFormValues[] | null
}

export interface StudyModuleTranslationFormValues extends FormValues {
  id?: string | null
  name: string
  language: string
  description: string
}
