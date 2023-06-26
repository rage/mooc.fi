import { useMemo } from "react"

import { useRouter } from "next/router"

import { useTranslator } from "./useTranslator"
import { LanguageKey, TranslationKey } from "/translations"
import PagesTranslations from "/translations/pages"

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.mooc.fi"
    : "http://localhost:3000"

export default function useAlternateLanguage() {
  const { locale, asPath } = useRouter()
  const t = useTranslator(PagesTranslations)

  const alternateLanguage = useMemo(() => {
    const origin =
      (typeof window !== "undefined" ? window?.location.origin : undefined) ??
      BASE_URL

    let newPath = (
      locale === "en"
        ? asPath.replace("/en/", "/").replace(/#(.*)/, "")
        : asPath.replace(/#(.*)/, "")
    ) as TranslationKey<(typeof PagesTranslations)[LanguageKey]["alternate"]>
    if (t("alternate")?.[newPath]) {
      newPath = t("alternate")?.[newPath] as typeof newPath
    }

    if (locale === "en") {
      return { hrefLang: "fi-FI", href: origin + newPath }
    }
    return { hrefLang: "en-US", href: `${origin}/en${newPath}` }
  }, [locale, asPath, t])

  return alternateLanguage
}
