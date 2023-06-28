import { useMemo } from "react"

import { type DefaultSeoProps } from "next-seo"
import { useRouter } from "next/router"

import { useTranslator } from "./useTranslator"
import { LanguageKey, TranslationKey } from "/translations"
import PagesTranslations from "/translations/pages"

const defaultSeoConfig: DefaultSeoProps = {
  titleTemplate: "%s - MOOC.fi",
  defaultTitle: "MOOC.fi",
}

type TitleTemplateKey = TranslationKey<
  (typeof PagesTranslations)[LanguageKey]["titleTemplate"]
>

export default function useSeoConfig() {
  const { pathname, asPath } = useRouter()
  const t = useTranslator(PagesTranslations)

  const seoConfig = useMemo(() => {
    const titleTemplates = t("titleTemplate")
    const titleTemplate =
      titleTemplates?.[(pathname ?? "") as TitleTemplateKey] ??
      titleTemplates?.[(asPath ?? "") as TitleTemplateKey]

    if (titleTemplate) {
      return {
        ...defaultSeoConfig,
        titleTemplate: `${titleTemplate} - MOOC.fi`,
        defaultTitle: `${titleTemplate.replace(" - %s", "")} - MOOC.fi`,
      }
    }
    return defaultSeoConfig
  }, [pathname, asPath, t])

  return seoConfig
}
