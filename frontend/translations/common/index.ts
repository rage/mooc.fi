// generated Wed Jun 21 2023 18:08:53 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en.json"
import fi from "./fi.json"
import se from "./se.json"
import { LanguageKey, TranslationDictionary } from "/translations"
import { make } from "/util/brand"

export type Common = typeof en | typeof fi | typeof se

const CommonTranslations: TranslationDictionary<Common> = {
  [make<LanguageKey>()("en")]: en,
  [make<LanguageKey>()("fi")]: fi,
  [make<LanguageKey>()("se")]: se,
} as const

export default CommonTranslations
