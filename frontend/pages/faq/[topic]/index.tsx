import { ContentBox, FAQPage, SectionBox } from "/components/Home/FAQ/Common"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useFAQPage } from "/hooks/useFAQPage"
import FAQTranslations from "/translations/faq"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

export default function FAQTopic() {
  const t = useTranslator(FAQTranslations)
  const topic: string = useQueryParameter("topic")

  const { Component, title, ingress, error, render } = useFAQPage(topic)

  useBreadcrumbs([
    {
      translation: "faq",
      href: `/faq`,
    },
    {
      label: title,
      href: `/faq/${topic}`,
    },
  ])
  // TODO: add dynamic title

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
