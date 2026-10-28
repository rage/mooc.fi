const nextLanguageToLocale: { [key: string]: string } = {
  fi: "fi_FI",
  se: "sv_SE",
  en: "en_US",
}

export const mapNextLanguageToLocaleCode = (language: string) =>
  nextLanguageToLocale[language] ?? "fi_FI"

const localeToNextLanguage = Object.fromEntries(
  Object.entries(nextLanguageToLocale).map(([language, locale]) => [
    locale,
    language,
  ]),
)

/** Inverse of `mapNextLanguageToLocaleCode`: "sv_SE" → "se", also the language tag id. */
export const mapLocaleCodeToNextLanguage = (locale: string) =>
  localeToNextLanguage[locale]
