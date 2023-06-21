// generated Wed Jun 21 2023 18:08:53 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en.json"
import fi from "./fi.json"
import { LanguageKey, TranslationDictionary } from "/translations"
import { make } from "/util/brand"

export type Profile = typeof en | typeof fi

const ProfileTranslations: TranslationDictionary<Profile> = {
  [make<LanguageKey>()("en")]: en,
  [make<LanguageKey>()("fi")]: fi,
} as const

export default ProfileTranslations
