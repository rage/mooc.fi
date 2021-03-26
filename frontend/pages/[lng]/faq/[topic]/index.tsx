import FAQTranslations from "/translations/faq"
import { ContentBox, FAQPage, SectionBox } from "/components/Home/FAQ/Common"
import { useTranslator } from "/util/useTranslator"
import { useFAQPage } from "/hooks/useFAQPage"
import { useQueryParameter } from "/util/useQueryParameter"

export default function FAQTopic() {
  const t = useTranslator(FAQTranslations)
  const topic: string = useQueryParameter("topic")

  const { Component, title, ingress, error, render } = useFAQPage(topic)

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
