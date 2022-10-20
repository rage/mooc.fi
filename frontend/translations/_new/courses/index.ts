import en from "./en.json"
import fi from "./fi.json"
import { TranslationDictionary } from "/translations"

export type CoursesTranslations = typeof en & typeof fi
const CoursesTranslations: TranslationDictionary<CoursesTranslations> = {
  en,
  fi,
}

export default CoursesTranslations
