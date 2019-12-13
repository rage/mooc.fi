import * as React from "react"
import { NextPageContext as NextContext } from "next"
import { useQuery } from "@apollo/react-hooks"
import AdminError from "/components/Dashboard/AdminError"
import { Container, Grid, CircularProgress } from "@material-ui/core"
import { WideContainer } from "/components/Container"
import { AllEditorModulesWithTranslations } from "/static/types/generated/AllEditorModulesWithTranslations"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import ModuleGrid from "/components/ModuleGrid"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { AllEditorModulesQuery } from "/graphql/queries/study-modules"

interface StudyModuleProps {
  admin: boolean
}

const StudyModules = ({ admin }: StudyModuleProps) => {
  const { loading, error, data } = useQuery<AllEditorModulesWithTranslations>(
    AllEditorModulesQuery,
  )

  if (error) {
    return <ModifiableErrorMessage ErrorMessage={JSON.stringify(error)} />
  }

  if (!admin) {
    return <AdminError />
  }
  if (loading || !data) {
    return (
      <>
        <Container style={{ display: "flex", height: "600px" }}>
          <Grid item container justify="center" alignItems="center">
            <CircularProgress color="primary" size={60} />
          </Grid>
        </Container>
      </>
    )
  }

  return (
    <>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          All Study Modules
        </H1NoBackground>
        <ModuleGrid modules={data.study_modules} />
      </WideContainer>
    </>
  )
}

StudyModules.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    // @ts-ignore
    language: context?.req?.language || "",
  }
}

export default StudyModules
