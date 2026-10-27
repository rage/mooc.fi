import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

export const translationLanguages = ["fi_FI", "en_US", "sv_SE"] as const

export function useTranslationLanguageNames(): Record<string, string> {
  const t = useTranslator(CoursesTranslations)

  return {
    fi_FI: t("courseFinnish"),
    en_US: t("courseEnglish"),
    sv_SE: t("courseSwedish"),
  }
}
