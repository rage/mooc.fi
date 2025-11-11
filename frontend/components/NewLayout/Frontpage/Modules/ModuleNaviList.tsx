import ContentWrapper from "../../Common/ContentWrapper"
import LinkBoxList from "../../Common/LinkBoxList"
import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

import { StudyModuleFieldsFragment } from "/graphql/generated"

interface ModuleNaviListProps {
  modules?: Array<StudyModuleFieldsFragment> | null
  loading?: boolean
}

function ModuleNaviList({ modules, loading }: ModuleNaviListProps) {
  const t = useTranslator(HomeTranslations)

  return (
    <ContentWrapper>
      <LinkBoxList
        loading={loading}
        hasImage
        hasDescription
        items={
          modules?.map(({ name, description, slug, image }) => ({
            title: name,
            description: description ?? undefined,
            linkProps: {
              href: `/study-modules/#${slug}`,
              children: t("moduleInformation"),
            },
            imageProps: {
              src: `/images/modules/${image}`,
              alt: "",
              fill: true,
            },
          })) ?? []
        }
      />
    </ContentWrapper>
  )
}

export default ModuleNaviList
