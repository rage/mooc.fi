import { useContext, useEffect, useState } from "react"
import {
  ContentBox,
  FAQComponent,
  SectionBox,
  FAQPage,
} from "/components/Home/FAQ/Common"
import LanguageContext from "../../../contexts/LanguageContext"

export default function FAQ() {
  const { language } = useContext(LanguageContext)

  const [render, setRender] = useState(false)
  const [error, setError] = useState(false)
  const [title, setTitle] = useState("")
  const [ingress, setIngress] = useState("")

  useEffect(() => setRender(true), [])

  const Component = FAQComponent({
    mdxImport: () => import(`../../../static/md_pages/toc_faq_${language}.mdx`),
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
            <SectionBox>Could not load FAQ page.</SectionBox>
          </ContentBox>
        ) : null}
      </>
    ),
  })
}
