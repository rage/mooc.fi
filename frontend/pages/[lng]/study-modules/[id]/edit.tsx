import React, { useContext } from "react"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { SingletonRouter, withRouter } from "next/router"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { WideContainer } from "/components/Container"
import styled from "styled-components"
import { StudyModuleDetails } from "/static/types/generated/StudyModuleDetails"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import LangLink from "/components/LangLink"
import LanguageContext from "/contexes/LanguageContext"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1NoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"

export const StudyModuleQuery = gql`
  query StudyModuleDetails($slug: String!) {
    study_module(slug: $slug) {
      id
      slug
      name
      image
      order
      courses {
        id
        name
        slug
      }
      study_module_translations {
        id
        name
        language
        description
      }
    }
  }
`

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

interface EditStudyModuleProps {
  router: SingletonRouter
}

const EditStudyModule = (props: EditStudyModuleProps) => {
  const { router } = props
  const { language } = useContext(LanguageContext)
  const id = useQueryParameter("id")

  let redirectTimeout: number | null = null

  const { data, loading, error } = useQuery<StudyModuleDetails>(
    StudyModuleQuery,
    {
      variables: { slug: id },
    },
  )

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  const listLink = `${language ? "/" + language : ""}/study-modules`

  if (!loading && !data?.study_module && typeof window !== "undefined") {
    redirectTimeout = setTimeout(
      () => router.push("/[lng]/study-modules", listLink, { shallow: true }),
      5000,
    )
  }

  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          Edit study module
        </H1NoBackground>
        {loading ? (
          <FormSkeleton />
        ) : data?.study_module ? (
          <StudyModuleEdit module={data.study_module} />
        ) : (
          <ErrorContainer elevation={2}>
            <Typography variant="body1">
              Study module with slug <b>{id}</b> not found!
            </Typography>
            <Typography variant="body2">
              You will be redirected back to the module list in 5 seconds -
              press{" "}
              <LangLink href={listLink}>
                <a
                  onClick={() =>
                    redirectTimeout && clearTimeout(redirectTimeout)
                  }
                  href=""
                >
                  here
                </a>
              </LangLink>{" "}
              to go there now.
            </Typography>
          </ErrorContainer>
        )}
      </WideContainer>
    </section>
  )
}

EditStudyModule.displayName = "EditStudyModule"

export default withRouter(withAdmin(EditStudyModule) as any)
