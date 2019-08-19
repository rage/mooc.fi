import React from "react"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { SingletonRouter, withRouter } from "next/router"
import AdminError from "/components/Dashboard/AdminError"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { WideContainer } from "/components/Container"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import styled from "styled-components"
import { StudyModuleDetails } from "/static/types/generated/StudyModuleDetails"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import LangLink from "/components/LangLink"

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

const Header = styled(Typography)`
  margin-top: 1em;
`

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

interface EditStudyModuleProps {
  router: SingletonRouter
  admin: boolean
  nameSpacesRequired: string[]
  language: string
}

const EditStudyModule = (props: EditStudyModuleProps) => {
  const { admin, router, language } = props
  const id = router.query.id

  let redirectTimeout: number | null = null

  const { data, loading, error } = useQuery<StudyModuleDetails>(
    StudyModuleQuery,
    {
      variables: { slug: id },
    },
  )

  if (!admin) {
    return <AdminError />
  }

  if (loading) {
    // TODO: spinner
    return null
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  const listLink = `${language ? "/" + language : ""}/study-modules`

  if (!data!.study_module) {
    redirectTimeout = setTimeout(() => router.push(listLink), 5000)
  }

  return (
    <section>
      <WideContainer>
        <Header component="h1" variant="h2" gutterBottom={true} align="center">
          Edit study module
        </Header>
        {data!.study_module ? (
          <StudyModuleEdit module={data!.study_module} />
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

EditStudyModule.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    // @ts-ignore
    language: context && context.req ? context.req.language : "",
    namespacesRequired: ["common"],
  }
}

export default withRouter(EditStudyModule)
