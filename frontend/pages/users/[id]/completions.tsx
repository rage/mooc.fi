import { useQuery } from "@apollo/client"

import Container from "/components/Container"
import { Completions } from "/components/Home/Completions"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import Spinner from "/components/Spinner"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"

import { UserOverviewDocument } from "/static/types/generated"

function CompletionsPage() {
  const id = useQueryParameter("id")

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
      href: `/users/${id}/completions`,
    },
  ])

  const completions = data?.user?.completions ?? []

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
      <Container>
        <div>
          <Completions completions={completions} />
        </div>
      </Container>
    </>
  )
}

CompletionsPage.displayName = "CompletionsPage"

export default withAdmin(CompletionsPage)
