import { generateNextSeo } from "next-seo/pages"
import Head from "next/head"

import { useQuery } from "@apollo/client/react"
import { styled } from "@mui/material/styles"

import Container from "/components/Container"
import ExternalUserLinks from "/components/Dashboard/Users/ExternalUserLinks"
import { Completions } from "/components/Home/Completions"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import Spinner from "/components/Spinner"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import withAdmin from "/lib/with-admin"

import { UserOverviewDocument } from "/graphql/generated"

const Links = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
`

function CompletionsPage() {
  const id = useQueryParameter("id")
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"

  const { loading, error, data } = useQuery(UserOverviewDocument, {
    variables: { upstream_id: Number(id) },
  })

  useBreadcrumbs([
    {
      translation: "users",
    },
    {
      label: id,
    },
    {
      translation: "userCompletions",
      href: `${baseUrl}/users/${id}/completions`,
    },
  ])

  const completions = data?.user?.completions

  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
      />
    )
  }

  if (loading || !data) {
    return <Spinner />
  }

  return (
    <>
      <Head>{generateNextSeo({ title: data.user?.full_name ?? id })}</Head>
      <Container>
        {data.user && (
          <Links>
            <ExternalUserLinks upstreamId={data.user.upstream_id} />
          </Links>
        )}
        <Completions completions={completions} />
      </Container>
    </>
  )
}

CompletionsPage.displayName = "CompletionsPage"

export default withAdmin(CompletionsPage)
