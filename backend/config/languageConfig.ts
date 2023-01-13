export const languageInfo = [
  {
    language: "se",
    completion_language: "sv_SE",
    country: "Sweden",
    langName: "Swedish",
  },
  {
    language: "sv",
    completion_language: "sv_SE",
    country: "Sweden",
    langName: "Swedish",
  },
  {
    language: "fi",
    completion_language: "fi_FI",
    country: "Finland",
    langName: "Finnish",
  },
  {
    language: "ee",
    completion_language: "et_EE",
    country: "Estonia",
    langName: "Estonian",
  },
  {
    language: "de",
    completion_language: "de_DE",
    country: "Germany",
    langName: "German",
  },
  {
    language: "no",
    completion_language: "nb_NO",
    country: "Norway",
    langName: "Norwegian",
  },
  {
    language: "lv",
    completion_language: "lv_LV",
    country: "Latvia",
    langName: "Latvian",
  },
  {
    language: "lt",
    completion_language: "lt_LT",
    country: "Lithuania",
    langName: "Lithuanian",
  },
  {
    language: "fr",
    completion_language: "fr_FR",
    country: "France",
    langName: "French",
  },
  {
    language: "fr-be",
    completion_language: "fr_BE",
    country: "Belgium",
    langName: "French (Belgium)",
  },
  {
    language: "nl-be",
    completion_language: "nl_BE",
    country: "Belgium",
    langName: "Dutch (Belgium)",
  },
  {
    language: "mt",
    completion_language: "mt_MT",
    country: "Malta",
    langName: "Maltan",
  },
  {
    language: "en-ie",
    completion_language: "en_IE",
    country: "Ireland",
    langName: "English (Ireland)",
  },
  {
    language: "pl",
    completion_language: "pl_PL",
    country: "Poland",
    langName: "Polish",
  },
  {
    language: "hr",
    completion_language: "hr_HR",
    country: "Croatia",
    langName: "Croatian",
  },
  {
    language: "ro",
    completion_language: "ro_RO",
    country: "Romania",
    langName: "Romanian",
  },
  {
    language: "da",
    completion_language: "da_DK",
    country: "Denmark",
    langName: "Danish",
  },
  {
    language: "it",
    completion_language: "it_IT",
    country: "Italy",
    langName: "Italian",
  },
  {
    language: "cs",
    completion_language: "cs_CZ",
    country: "Czech Republic",
    langName: "Czech",
  },
  {
    language: "bg",
    completion_language: "bg_BG",
    country: "Bulgaria",
    langName: "Bulgarian",
  },
  {
    language: "en-lu",
    completion_language: "en_LU",
    country: "Luxembourg",
    langName: "English (Luxembourg)",
  },
  {
    language: "sk",
    completion_language: "sk_SK",
    country: "Slovakia",
    langName: "Slovak",
  },
  {
    language: "nl",
    completion_language: "nl_NL",
    country: "Netherlands",
    langName: "Dutch (Netherlands)",
  },
  {
    language: "pt",
    completion_language: "pt_PT",
    country: "Portugal",
    langName: "Portuguese",
  },
  {
    language: "de-at",
    completion_language: "de_AT",
    country: "Austria",
    langName: "German (Austria)",
  },
  {
    language: "el",
    completion_language: "el_GR",
    country: "Greece",
    langName: "Greek",
  },
  {
    language: "es",
    completion_language: "es_ES",
    country: "Spain",
    langName: "Spanish",
  },
  {
    language: "sl",
    completion_language: "sl_SI",
    country: "Slovenia",
    langName: "Slovenian",
  },
  {
    language: "is",
    completion_language: "is_IS",
    country: "Iceland",
    langName: "Icelandic",
  },
  {
    language: "ga",
    completion_language: "ga_IE",
    country: "Ireland",
    langName: "Irish",
  },
  {
    language: "el-cy",
    completion_language: "el_CY",
    country: "Cyprus",
    langName: "Greek (Cyprus)",
  },
  {
    language: "en",
    completion_language: "en_US",
    country: "English (US)",
    langName: "English",
  },
] as const

export type LanguageInfo = typeof languageInfo[number]
export type LanguageAbbreviation = LanguageInfo["language"]
export type CompletionLanguage = LanguageInfo["completion_language"]

export const completionLanguageMap = {} as Record<
  LanguageAbbreviation,
  CompletionLanguage
>

for (const entry of languageInfo) {
  completionLanguageMap[entry.language] = entry.completion_language
}
