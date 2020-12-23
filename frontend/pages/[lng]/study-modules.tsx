import { useQuery } from "@apollo/client"
import { WideContainer } from "/components/Container"
import { AllEditorModulesWithTranslations } from "/static/types/generated/AllEditorModulesWithTranslations"
import ModuleGrid from "/components/ModuleGrid"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { AllEditorModulesQuery } from "/graphql/queries/study-modules"
import withAdmin from "/lib/with-admin"
import StudyModulesTranslations from "/translations/study-modules"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/translations"

function StudyModules() {
  const t = useTranslator(StudyModulesTranslations)

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
