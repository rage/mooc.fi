import { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { FAQComponent } from "/components/Home/FAQ/Common"
import FAQTranslations from "/translations/faq"
import { useTranslator } from "/util/useTranslator"

type MDXComponent<T> = {
  meta?: {
    title?: string
    ingress?: string
    breadcrumb?: string
  }
} & React.ComponentType<T>

export function useFAQPage(topic = "toc_faq") {
  const t = useTranslator(FAQTranslations)
  const { locale } = useRouter()

  const [render, setRender] = useState(false)
  const [error, setError] = useState(false)
  const [title, setTitle] = useState("")
  const [ingress, setIngress] = useState("")
  const [breadcrumb, setBreadcrumb] = useState("")

  useEffect(() => setRender(true), [])

  const sanitizedTopic = topic?.replace(/[./\\]/g, "").trim()

  const Component = FAQComponent({
    mdxImport: () =>
      import(`../public/md_pages/${sanitizedTopic}_${locale}.mdx`),
    onSuccess: (mdx: MDXComponent<any>) => {
      setTitle(mdx?.meta?.title ?? "")
      setIngress(mdx?.meta?.ingress ?? "")
      setBreadcrumb(mdx?.meta?.breadcrumb ?? mdx?.meta?.title ?? "")
      return mdx
    },
    onError: (errorComponent) => {
      setError(true)
      setTitle(t("error"))
      setBreadcrumb(t("error"))
      return errorComponent ?? null
    },
  })

  return {
    Component,
    render,
    error,
    title,
    ingress,
    breadcrumb,
  }
}
