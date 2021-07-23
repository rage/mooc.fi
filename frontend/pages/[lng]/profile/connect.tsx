import { useQuery } from "@apollo/client"
import React from "react"
import Container from "/components/Container"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import OrganizationConnectionList from "../../../components/Profile/OrganizationConnection/OrganizationConnectionList"
import Spinner from "/components/Spinner"
import { UserOverViewQuery } from "/graphql/queries/currentUser"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedIn from "/lib/with-signed-in"
import { CurrentUserUserOverView } from "/static/types/generated/CurrentUserUserOverView"
import useDisconnect from "/components/Profile/OrganizationConnection/useDisconnect"

function Connection() {
  const { data, loading, error } = useQuery<CurrentUserUserOverView>(
    UserOverViewQuery,
  )
  const { onDisconnect } = useDisconnect()

  useBreadcrumbs([
    {
      translation: "profile",
      href: "/profile",
    },
    {
      translation: "profileConnect",
      href: `/profile/connect`,
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
        <OrganizationConnectionList
          data={data?.currentUser?.verified_users}
          onDisconnect={onDisconnect}
        />
      </Container>
    </>
  )
}

export default withSignedIn(Connection)
