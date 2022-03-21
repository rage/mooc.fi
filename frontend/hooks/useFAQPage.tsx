import { useEffect, useState } from "react"

import { FAQComponent } from "/components/Home/FAQ/Common"
import { useRouter } from "next/router"

export function useFAQPage(topic: string) {
  const { locale } = useRouter()

  const [render, setRender] = useState(false)
  const [error, setError] = useState(false)
  const [title, setTitle] = useState("")
  const [ingress, setIngress] = useState("")

  useEffect(() => setRender(true), [])

  const sanitizedTopic = topic.replace(/[./\\]/g, "").trim()

  const Component = FAQComponent({
    mdxImport: () =>
      import(`../static/md_pages/${sanitizedTopic}_${locale}.mdx`),
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
