import { useQuery } from "@apollo/client"

import { WideContainer } from "/components/Container"
import ModuleGrid from "/components/Dashboard/StudyModules/ModuleGrid"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import StudyModulesTranslations from "/translations/study-modules"

import { EditorStudyModulesDocument } from "/graphql/generated"

function StudyModules() {
  const t = useTranslator(StudyModulesTranslations)

  useBreadcrumbs([
    {
      translation: "studyModules",
      href: "/_new/study-modules",
    },
  ])

  const { loading, error, data } = useQuery(EditorStudyModulesDocument)

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  return (
    <>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("allStudyModules")}
        </H1NoBackground>
        <ModuleGrid modules={data?.study_modules} loading={loading} />
      </WideContainer>
    </>
  )
}

export default withAdmin(StudyModules)
