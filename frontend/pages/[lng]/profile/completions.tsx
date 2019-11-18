import React from "react"
import { isSignedIn } from "/lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "/lib/redirect"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { CurrentUserUserOverView as UserOverViewData } from "/static/types/generated/CurrentUserUserOverView"
import Container from "/components/Container"
import Completions from "/components/Completions"

export const UserOverViewQuery = gql`
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
  const { loading, error, data } = useQuery<UserOverViewData>(UserOverViewQuery)
  if (error) {
    return (
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    )
  }

  if (loading || !data) {
    return <div>Loading</div>
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

CompletionsPage.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {}
}

export default CompletionsPage
