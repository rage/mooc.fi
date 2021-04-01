import { useContext, useState, useEffect } from "react"
import { FAQComponent } from "/components/Home/FAQ/Common"
import LanguageContext from "/contexts/LanguageContext"

export function useFAQPage(topic: string) {
  const { language } = useContext(LanguageContext)

  const [render, setRender] = useState(false)
  const [error, setError] = useState(false)
  const [title, setTitle] = useState("")
  const [ingress, setIngress] = useState("")

  useEffect(() => setRender(true), [])

  const sanitizedTopic = topic.replace(/[./\\]/g, "").trim()

  const Component = FAQComponent({
    mdxImport: () =>
      import(`../static/md_pages/${sanitizedTopic}_${language}.mdx`),
    onSuccess: (mdx: any) => {
      setTitle(mdx?.meta?.title ?? "")
      setIngress(mdx?.meta?.ingress ?? "")

      return mdx
    },
    onError: () => setError(true),
  })

  return {
    Component,
    render,
    error,
    title,
    ingress,
  }
}
