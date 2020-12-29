// generated Mon Dec 28 2020 22:02:16 GMT+0200 (Eastern European Standard Time)

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
