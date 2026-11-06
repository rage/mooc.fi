import { generateNextSeo } from "next-seo/pages"
import Head from "next/head"
import { useRouter } from "next/router"

import { ContentBox, FAQPage, SectionBox } from "/components/Home/FAQ/Common"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useFAQPage } from "/hooks/useFAQPage"
import { useTranslator } from "/hooks/useTranslator"
import FAQTranslations from "/translations/faq"

function FAQTopic() {
  const router = useRouter()
  const topic = router.query.topic?.[0] ?? "toc_faq"
  const t = useTranslator(FAQTranslations)

  const { Component, meta, error, render } = useFAQPage(topic)

  const { title, breadcrumb } = meta ?? {}

  useBreadcrumbs([
    {
      translation: "faq",
      href: `/faq`,
    },
    {
      label: error ? topic : breadcrumb,
      href: `/faq/${topic}`,
    },
  ])

  return (
    <>
      <Head>{generateNextSeo({ title: title ?? "..." })}</Head>
      <FAQPage meta={meta} error={error}>
        {render && <Component />}
        {error ? (
          <ContentBox>
            <SectionBox>{t("unknownTopic", { topic })}</SectionBox>
          </ContentBox>
        ) : null}
      </FAQPage>
    </>
  )
}

export default FAQTopic
