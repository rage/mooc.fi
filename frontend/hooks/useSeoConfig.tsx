import { useMemo } from "react"

import { type DefaultSeoProps } from "next-seo"
import { useRouter } from "next/router"

import { useTranslator } from "./useTranslator"
import PagesTranslations from "/translations/pages"

const defaultSeoConfig: DefaultSeoProps = {
  titleTemplate: "%s - MOOC.fi",
  defaultTitle: "MOOC.fi",
}

export default function useSeoConfig() {
  const { pathname, asPath } = useRouter()
  const t = useTranslator(PagesTranslations)

  const seoConfig = useMemo(() => {
    const titleTemplates = t("titleTemplate")
    const titleTemplate =
      titleTemplates?.[pathname ?? ""] ?? titleTemplates?.[asPath ?? ""]

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
