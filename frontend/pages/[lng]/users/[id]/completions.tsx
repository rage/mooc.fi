import React from "react"
import { isSignedIn, isAdmin } from "/lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "/lib/redirect"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { ShowUserUserOverView as UserOverViewData } from "/static/types/generated/ShowUserUserOverView"
import Container from "/components/Container"
import Completions from "/components/Completions"
import AdminError from "/components/Dashboard/AdminError"
import { useQueryParameter } from "/util/useQueryParameter"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"

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
  admin: boolean
}

function CompletionsPage({ admin }: CompletionsProps) {
  const id = useQueryParameter("id")

  const { loading, error, data } = useQuery<UserOverViewData>(
    UserOverViewQuery,
    { variables: { upstream_id: Number(id) }, ssr: false },
  )

  if (!admin) {
    return <AdminError />
  }

  const completions = data?.user?.completions ?? []

  if (error) {
    return (
      <ModifiableErrorMessage
        ErrorMessage={JSON.stringify(error, undefined, 2)}
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

CompletionsPage.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default CompletionsPage
