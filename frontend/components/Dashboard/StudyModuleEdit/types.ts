export interface StudyModuleFormValues {
  id?: string | null
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
