import PagesTranslations from "/translations/pages"
import { useTranslator } from "/util/useTranslator"
import { useRouter } from "next/router"

/*const useSubtitle = (variables: Record<string, any> = {}) => {
  const t = useTranslator(PagesTranslations)
  const router = useRouter()
  const documentDefined = typeof document !== 'undefined'
  const originalTitle = useRef(documentDefined ? document.title : null)
  
  console.log("got hook with", variables)
  useEffect(() => {
    if (!documentDefined) return () => {}
    console.log("ran effect with", variables, router.pathname)

    const titleString =  t("title", variables)?.[router.pathname ?? ""] 
    const title = `${titleString ? titleString + " - " : ""}MOOC.fi`
    if (document.title !== title) {
      console.log("set title to", title)
      document.title = title
    }

    return () => {
      document.title = originalTitle.current ?? document.title
    }
  }, [JSON.stringify(variables)])
}*/

const useSubtitle = (subtitle?: string) => {
  const t = useTranslator(PagesTranslations)
  const { pathname } = useRouter()

  const titleString = t("title", { title: subtitle ?? "..." })?.[pathname ?? ""]

  const title = `${titleString ? titleString + " - " : ""}MOOC.fi`

  return title
}

export default useSubtitle
