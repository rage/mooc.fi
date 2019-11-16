import React from "react"
import { isSignedIn, isAdmin } from "/lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "/lib/redirect"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import {
  ShowUserUserOverView as UserOverViewData,
  ShowUserUserOverView_user_completions,
} from "/static/types/generated/ShowUserUserOverView"
import Container from "/components/Container"
import Completions from "/components/Completions"
import { SingletonRouter, withRouter } from "next/router"
import AdminError from "/components/Dashboard/AdminError"

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

interface CompletionsProps {
  router: SingletonRouter
  admin: boolean
}

function CompletionsPage(props: CompletionsProps) {
  const { router } = props

  if (!props.admin) {
    return <AdminError />
  }
  const { loading, error, data } = useQuery<UserOverViewData>(
    UserOverViewQuery,
    { variables: { upstream_id: Number(router.query.id) } },
  )

  const completions = data?.user?.completions ?? []

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
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default withRouter(CompletionsPage)
