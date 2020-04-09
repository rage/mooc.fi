import React from "react"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { CurrentUserUserOverView as UserOverViewData } from "/static/types/generated/CurrentUserUserOverView"
import Container from "/components/Container"
import Completions from "/components/Completions"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withSignedIn from "/lib/with-signed-in"

export const CompletionsUserOverViewQuery = gql`
  query CurrentUserUserOverView {
    currentUser {
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
  const { loading, error, data } = useQuery<UserOverViewData>(
    CompletionsUserOverViewQuery,
  )

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

  const completions = data?.currentUser?.completions ?? []

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

export default withSignedIn(CompletionsPage)
