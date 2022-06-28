// generated Tue Apr 13 2021 16:34:47 GMT+0300 (GMT+03:00)
import en from "./en.json"
import fi from "./fi.json"
import se from "./se.json"
import { TranslationDictionary } from "/translations"

export type CommonTranslations = typeof en & typeof fi & typeof se
const CommonTranslations: TranslationDictionary<CommonTranslations> = {
  en,
  fi,
  se,
}

export default CommonTranslations
