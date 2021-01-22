import { useContext, useEffect, useState } from "react"
import LanguageContext from "/contexes/LanguageContext"
import FAQTranslations from "/translations/faq"
import { useQueryParameter } from "/util/useQueryParameter"
import {
  ContentBox,
  FAQComponent,
  FAQPage,
  SectionBox,
} from "/components/Home/FAQ/Common"
import { useTranslator } from "/util/useTranslator"

export default function FAQTopic() {
  const { language } = useContext(LanguageContext)
  const t = useTranslator(FAQTranslations)

  const [render, setRender] = useState(false)
  const [error, setError] = useState(false)
  const [title, setTitle] = useState("")
  const [ingress, setIngress] = useState("")

  useEffect(() => setRender(true), [])

  const topic: string = useQueryParameter("topic")
  const sanitizedTopic = topic.replace(/[./\\]/g, "").trim()

  const Component = FAQComponent({
    mdxImport: () =>
      import(`../../../../static/md_pages/${sanitizedTopic}_${language}.mdx`),
    onSuccess: (mdx: any) => {
      setTitle(mdx?.meta?.title ?? "")
      setIngress(mdx?.meta?.ingress ?? "")

      return mdx
    },
    onError: () => setError(true),
  })

  return FAQPage({
    title,
    ingress,
    error,
    content: (
      <>
        {render && !error ? <Component /> : null}
        {error ? (
          <ContentBox>
            <SectionBox>{t("unknownTopic", { topic })}</SectionBox>
          </ContentBox>
        ) : null}
      </>
    ),
  })
}
