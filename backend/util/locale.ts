const localeMap: Record<string, string> = {
  en: "en_US",
  fi: "fi_FI",
}

export const localeToLanguage = (locale?: string) => {
  if (!locale) {
    return undefined
  }

  return localeMap[locale]
}
