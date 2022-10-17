import { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { FAQComponent } from "/components/Home/FAQ/Common"

type MDXComponent<T> = {
  meta?: {
    title?: string
    ingress?: string
    breadcrumb?: string
  }
} & React.ComponentType<T>

export function useFAQPage(topic: string) {
  const { locale } = useRouter()

  const [render, setRender] = useState(false)
  const [error, setError] = useState(false)
  const [title, setTitle] = useState("")
  const [ingress, setIngress] = useState("")
  const [breadcrumb, setBreadcrumb] = useState("")

  useEffect(() => setRender(true), [])

  const sanitizedTopic = topic.replace(/[./\\]/g, "").trim()

  const Component = FAQComponent({
    mdxImport: () =>
      import(`../static/md_pages/${sanitizedTopic}_${locale}.mdx`),
    onSuccess: (mdx: MDXComponent<any>) => {
      setTitle(mdx?.meta?.title ?? "")
      setIngress(mdx?.meta?.ingress ?? "")
      setBreadcrumb(mdx?.meta?.breadcrumb ?? mdx?.meta?.title ?? "")
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
    breadcrumb,
  }
}
