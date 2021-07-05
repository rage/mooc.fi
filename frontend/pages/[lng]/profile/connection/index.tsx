import { useQuery } from "@apollo/client"
import React from "react"
import Container from "/components/Container"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import ConnectionList from "/components/Profile/Connection/ConnectionList"
import Spinner from "/components/Spinner"
import { UserOverViewQuery } from "/graphql/queries/currentUser"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedIn from "/lib/with-signed-in"
import { CurrentUserUserOverView } from "/static/types/generated/CurrentUserUserOverView"

function Connection() {
  const { data, loading, error } = useQuery<CurrentUserUserOverView>(
    UserOverViewQuery,
  )

  useBreadcrumbs([
    {
      translation: "profile",
      href: "/profile",
    },
    {
      translation: "profileConnection",
      href: `/profile/connection`,
    },
  ])

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
        <ConnectionList
          data={data?.currentUser?.verified_users}
          onDisconnect={() => {}}
        />
      </Container>
    </>
  )
}

export default withSignedIn(Connection)
