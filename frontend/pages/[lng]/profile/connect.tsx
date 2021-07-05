import { gql, useMutation, useQuery } from "@apollo/client"
import React from "react"
import Container from "/components/Container"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import ConnectionList from "/components/Profile/Connection/ConnectionList"
import Spinner from "/components/Spinner"
import { UserOverViewQuery } from "/graphql/queries/currentUser"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedIn from "/lib/with-signed-in"
import { CurrentUserUserOverView } from "/static/types/generated/CurrentUserUserOverView"
import { DeleteVerifiedUser } from "/static/types/generated/DeleteVerifiedUser"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"

export const DeleteVerifiedUserMutation = gql`
  mutation DeleteVerifiedUser($personal_unique_code: String!) {
    deleteVerifiedUser(personal_unique_code: $personal_unique_code) {
      id
      personal_unique_code
    }
  }
`

function Connection() {
  const { data, loading, error } = useQuery<CurrentUserUserOverView>(
    UserOverViewQuery,
  )
  const [
    deleteVerifiedUser,
    { data: deleteData, error: deleteError },
  ] = useMutation<DeleteVerifiedUser>(DeleteVerifiedUserMutation, {
    refetchQueries: [
      {
        query: UserOverViewQuery,
      },
    ],
  })
  const onDisconnect = async (
    user: ProfileUserOverView_currentUser_verified_users,
  ) =>
    deleteVerifiedUser({
      variables: { personal_unique_code: user.personal_unique_code },
    })

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
        <ConnectionList
          data={data?.currentUser?.verified_users}
          onDisconnect={onDisconnect}
        />
      </Container>
    </>
  )
}

export default withSignedIn(Connection)
