import { FormValues } from "../types"

export interface TagFormValues extends FormValues {
  _id?: string
  types?: string[]
  tag_translations?: TagTranslationFormValues[]
}

export interface TagTranslationFormValues extends FormValues {
  _id?: string
  language: string
  name: string
  description?: string
}

export interface TagTypeFormValues extends FormValues {
  _id?: string
  name: string
}