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
  const router = useRouter()
  const t = useTranslator(PagesTranslations)

  const seoConfig = useMemo(() => {
    const titleTemplates = t("titleTemplate")
    const titleTemplate =
      titleTemplates?.[router?.pathname ?? ""] ??
      titleTemplates?.[router?.asPath ?? ""]

    if (titleTemplate) {
      return {
        ...defaultSeoConfig,
        titleTemplate: `${titleTemplate} - MOOC.fi`,
        defaultTitle: `${titleTemplate.replace(" - %s", "")} - MOOC.fi`,
      }
    }
    return defaultSeoConfig
  }, [router.pathname, t])

  return seoConfig
}
