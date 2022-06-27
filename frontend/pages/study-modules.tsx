import { useQuery } from "@apollo/client"

import { WideContainer } from "/components/Container"
import ModuleGrid from "/components/Dashboard/StudyModules/ModuleGrid"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { AllEditorModulesQuery } from "/graphql/queries/study-modules"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import { AllEditorModulesWithTranslations } from "/static/types/generated/AllEditorModulesWithTranslations"
import StudyModulesTranslations from "/translations/study-modules"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

function StudyModules() {
  const t = useTranslator(StudyModulesTranslations)

  useBreadcrumbs([
    {
      translation: "studyModules",
      href: "/study-modules",
    },
  ])

  const { loading, error, data } = useQuery<AllEditorModulesWithTranslations>(
    AllEditorModulesQuery,
  )

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  return (
    <>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("allStudyModules")}
        </H1NoBackground>
        <ModuleGrid
          modules={data?.study_modules?.filter(notEmpty)}
          loading={loading}
        />
      </WideContainer>
    </>
  )
}

export default withAdmin(StudyModules)
