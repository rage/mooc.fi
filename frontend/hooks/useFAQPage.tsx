import { useEffect, useMemo, useState } from "react"

import { useRouter } from "next/router"

import { FAQComponent } from "/components/Home/FAQ/Common"
import { useTranslator } from "/hooks/useTranslator"
import FAQTranslations from "/translations/faq"

type Meta = {
  title?: string
  ingress?: string
  breadcrumb?: string
}

type MDXComponent<T> = {
  meta?: Meta
} & React.ComponentType<T>

export function useFAQPage(topic?: string) {
  const t = useTranslator(FAQTranslations)
  const { locale } = useRouter()

  const [render, setRender] = useState(false)
  const [error, setError] = useState(false)
  const [meta, setMeta] = useState<Meta>({})

  useEffect(() => setRender(true), [])

  const sanitizedTopic = topic?.replace(/[./\\]/g, "").trim()

  const Component = useMemo(
    () =>
      FAQComponent({
        mdxImport: () =>
          import(`../public/md_pages/${sanitizedTopic}_${locale}.mdx`),
        onSuccess: (mdx: MDXComponent<any>) => {
          setError(false)
          setMeta({
            ...mdx?.meta,
            breadcrumb: mdx?.meta?.breadcrumb ?? mdx?.meta?.title,
          })

          return mdx
        },
        onError: (errorComponent) => {
          setError(true)
          setMeta((prev) => ({
            ...prev,
            title: t("error"),
            breadCrumb: t("error"),
          }))

          return errorComponent ?? null
        },
      }),
    [render, sanitizedTopic, locale, t],
  )

  return {
    Component,
    render,
    error,
    meta,
  }
}
