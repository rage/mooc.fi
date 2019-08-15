import React from "react"
import { isSignedIn } from "/lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "/lib/redirect"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import {
  CurrentUserUserOverView as UserOverViewData,
  CurrentUserUserOverView_currentUser_completions,
} from "/static/types/generated/CurrentUserUserOverView"
/* import styled from "styled-components"
import Typography from "@material-ui/core/Typography" */
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
  // FIXME: do the props have any use?
  // @ts-ignore

  const { loading, error, data } = useQuery<UserOverViewData>(UserOverViewQuery)
  let completions: CurrentUserUserOverView_currentUser_completions[] = []

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

  if (data.currentUser && data.currentUser.completions) {
    completions = data.currentUser.completions
  }
  return (
    <Container>
      <div>
        <Completions completions={completions} />
      </div>
    </Container>
  )
}

CompletionsPage.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    namespacesRequired: ["profile"],
  }
}

export default CompletionsPage
