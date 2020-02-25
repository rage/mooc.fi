import React from "react"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { ShowUserUserOverView as UserOverViewData } from "/static/types/generated/ShowUserUserOverView"
import Container from "/components/Container"
import Completions from "/components/Completions"
import { useQueryParameter } from "/util/useQueryParameter"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"

export const UserOverViewQuery = gql`
  query ShowUserUserOverView($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      id
      upstream_id
      first_name
      last_name
      email
      ...UserCompletions
    }
  }
  ${Completions.fragments.completions}
`

function CompletionsPage() {
  const id = useQueryParameter("id")

  const { loading, error, data } = useQuery<UserOverViewData>(
    UserOverViewQuery,
    { variables: { upstream_id: Number(id) } },
  )

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
