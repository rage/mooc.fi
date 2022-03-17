import { WideContainer } from "/components/Container"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import StudyModuleEdit2 from "/components/Dashboard/Editor2/StudyModule"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import StudyModuleTranslations from "/translations/study-modules"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

const NewStudyModule = () => {
  const t = useTranslator(StudyModuleTranslations)
  const beta = useQueryParameter("beta", false)

  useBreadcrumbs([
    {
      translation: "studyModules",
      href: "/study-modules",
    },
    {
      translation: "studyModuleNew",
      href: `/study-modules/new`,
    },
  ])

  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("newStudyModule")}
        </H1NoBackground>
        {beta ? <StudyModuleEdit2 /> : <StudyModuleEdit />}
      </WideContainer>
    </section>
  )
}

export default withAdmin(NewStudyModule)
