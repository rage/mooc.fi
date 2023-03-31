import { useRouter } from "next/router"

import { useTranslator } from "/hooks/useTranslator"
import PagesTranslations from "/translations/pages"

const useSubtitle = (subtitle?: string) => {
  const t = useTranslator(PagesTranslations)
  const { pathname } = useRouter()

  const title = t("title", { title: subtitle ?? "..." })?.[pathname ?? ""]

  return title
}

export default useSubtitle
