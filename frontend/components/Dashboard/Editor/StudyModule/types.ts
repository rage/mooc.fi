export interface StudyModuleFormValues {
  id?: string | null
  slug: string
  new_slug: string
  name: string
  image: string
  // courses: any[]
  study_module_translations: StudyModuleTranslationFormValues[]
}

export interface StudyModuleTranslationFormValues {
  id?: string | null
  name: string
  language: string
  description: string
  study_module?: string | undefined
}
