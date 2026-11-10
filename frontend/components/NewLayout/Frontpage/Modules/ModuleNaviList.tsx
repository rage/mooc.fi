import ContentWrapper from "../../Common/ContentWrapper"
import LinkBoxList from "../../Common/LinkBoxList"
import { useTranslator } from "/hooks/useTranslator"
import type { StudyModuleFields } from "/lib/api-types"
import HomeTranslations from "/translations/home"

interface ModuleNaviListProps {
  modules?: Array<StudyModuleFields> | null
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
              sizes: "(min-width: 768px) 50vw, 100vw",
            },
          })) ?? []
        }
      />
    </ContentWrapper>
  )
}

export default ModuleNaviList
