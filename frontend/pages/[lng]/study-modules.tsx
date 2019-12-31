import * as React from "react"
import { useQuery } from "@apollo/react-hooks"
import { WideContainer } from "/components/Container"
import { AllEditorModulesWithTranslations } from "/static/types/generated/AllEditorModulesWithTranslations"
import ModuleGrid from "/components/ModuleGrid"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { AllEditorModulesQuery } from "/graphql/queries/study-modules"
import withAdmin from "/lib/with-admin"
import withSignedIn from "/lib/with-signed-in"

const StudyModules = () => {
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
          All Study Modules
        </H1NoBackground>
        <ModuleGrid modules={data?.study_modules} loading={loading} />
      </WideContainer>
    </>
  )
}

export default withAdmin(withSignedIn(StudyModules))
