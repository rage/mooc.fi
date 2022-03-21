import PagesTranslations from "/translations/pages"
import { useTranslator } from "/util/useTranslator"
import { useRouter } from "next/router"

const useSubtitle = (subtitle?: string) => {
  const t = useTranslator(PagesTranslations)
  const { pathname } = useRouter()

  const titleString = t("title", { title: subtitle ?? "..." })?.[pathname ?? ""]

  const title = `${titleString ? titleString + " - " : ""}MOOC.fi`

  return title
}

export default useSubtitle
