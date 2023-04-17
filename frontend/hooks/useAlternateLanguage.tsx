import { useMemo } from "react"

import { useRouter } from "next/router"

import { useTranslator } from "./useTranslator"
import PagesTranslations from "/translations/pages"

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.mooc.fi"
    : "http://localhost:3000"

export default function useAlternateLanguage() {
  const router = useRouter()
  const t = useTranslator(PagesTranslations)

  const alternateLanguage = useMemo(() => {
    const origin =
      (typeof window !== "undefined" ? window?.location.origin : undefined) ??
      BASE_URL

    let newPath =
      router.locale === "en"
        ? router.asPath.replace("/en/", "/").replace(/#(.*)/, "")
        : router.asPath.replace(/#(.*)/, "")
    if (t("alternate")?.[newPath]) {
      newPath = t("alternate")?.[newPath]
    }

    if (router.locale === "en") {
      return { hrefLang: "fi-FI", href: origin + newPath }
    }
    return { hrefLang: "en-US", href: `${origin}/en${newPath}` }
  }, [router.locale, router.asPath, t])

  return alternateLanguage
}
