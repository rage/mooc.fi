import { useRouter } from "next/router"

import { useTranslator } from "/hooks/useTranslator"
import { LanguageKey, TranslationKey } from "/translations"
import PagesTranslations from "/translations/pages"

type TitleKey = TranslationKey<(typeof PagesTranslations)[LanguageKey]["title"]>

const useSubtitle = (subtitle?: string) => {
  const t = useTranslator(PagesTranslations)
  const { pathname } = useRouter()

  const title = t("title", { title: subtitle ?? "..." })?.[
    (pathname ?? "") as TitleKey
  ]

  return title
}

export default useSubtitle
