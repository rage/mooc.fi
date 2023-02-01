import { GetServerSidePropsContext } from "next"
import { NextSeo } from "next-seo"

import { ContentBox, FAQPage, SectionBox } from "/components/Home/FAQ/Common"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useFAQPage } from "/hooks/useFAQPage"
import useSubtitle from "/hooks/useSubtitle"
import FAQTranslations from "/translations/faq"
import { useTranslator } from "/util/useTranslator"

interface FAQTopicProps {
  topic: string
}

function FAQTopic({ topic }: FAQTopicProps) {
  const t = useTranslator(FAQTranslations)

  const { Component, title, ingress, breadcrumb, error, render } =
    useFAQPage(topic)

  useBreadcrumbs([
    {
      translation: "faq",
      href: `/faq`,
    },
    {
      label: breadcrumb,
      href: `/faq/${topic}`,
    },
  ])

  const pageTitle = useSubtitle(title)

  return FAQPage({
    title,
    ingress,
    error,
    content: (
      <>
        <NextSeo title={pageTitle} />
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

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  return {
    props: {
      topic: params?.topic,
    },
  }
}

export default FAQTopic
