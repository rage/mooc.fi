import { GetServerSidePropsContext } from "next"
import { NextSeo } from "next-seo"

import { ContentBox, FAQPage, SectionBox } from "/components/Home/FAQ/Common"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useFAQPage } from "/hooks/useFAQPage"
import { useTranslator } from "/hooks/useTranslator"
import FAQTranslations from "/translations/faq"

interface FAQTopicProps {
  topic: string
}

function FAQTopic({ topic }: FAQTopicProps) {
  const t = useTranslator(FAQTranslations)

  const { Component, meta, error, render } = useFAQPage(topic)

  const { title, breadcrumb } = meta ?? {}

  console.log(topic)

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
      <NextSeo title={title ?? "..."} />
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

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  return {
    props: {
      topic: params?.topic?.[0] ?? "toc_faq",
    },
  }
}

export default FAQTopic
