import { gql } from "@apollo/client"
import { useQuery, useMutation } from "@apollo/client"
import { Alert } from "@material-ui/core"
import { useRouter } from "next/router"
import React from "react"
import Container from "/components/Container"
import ErrorMessage from "/components/ErrorMessage"
import VerifiedUsers from "/components/Profile/VerifiedUsers/VerifiedUsers"
import Spinner from "/components/Spinner"
import { useLanguageContext } from "/contexts/LanguageContext"
import withSignedIn from "/lib/with-signed-in"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
import { useQueryParameter } from "/util/useQueryParameter"

export const ConnectionTestQuery = gql`
  query ConnectionTest {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      student_number
      email
      verified_users {
        id
        created_at
        personal_unique_code
        display_name
        home_organization
        person_affiliation
        person_affiliation_updated_at
        updated_at
      }
    }
  }
`

export const DeleteVerifiedUserMutation = gql`
  mutation eleteVerifiedUser(
    $personal_unique_code: String!
  ) {
    deleteVerifiedUser(
      personal_unique_code: $personal_unique_code
    ) {
      id
      personal_unique_code
    }
  }
`

function ConnectionTest() {
  const { language } = useLanguageContext()

  const { data, error, loading } = useQuery(ConnectionTestQuery)
  const [deleteVerifiedUser, { }] = useMutation(
    DeleteVerifiedUserMutation,
    {
      refetchQueries: [{
        query: ConnectionTestQuery
      }]
    }
  )
  const router = useRouter()

  const connectionSuccess = useQueryParameter("success", false)
  const connectionError = useQueryParameter("error", false)

  const decodedConnectionError = connectionError
    ? JSON.parse(Buffer.from(connectionError, "base64").toString("ascii"))
        ?.error
    : null

  if (error) {
    return <ErrorMessage />
  }

  if (loading) {
    return <Spinner />
  }

  const onDisconnect = (user: ProfileUserOverView_currentUser_verified_users) => {
    deleteVerifiedUser({ variables: { personal_unique_code: user.personal_unique_code }})
      .then((res) => router.replace(`/${language}/connection/test?success=${res.deleteVerifiedUser.id}`, undefined, { shallow: true }))
      .catch(() => router.replace(`/${language}/connection/test?error`))
  }

  return (
    <Container style={{ maxWidth: 900 }}>
      {connectionSuccess && (
        <Alert severity="success">Success!</Alert>
      )}
      {connectionError && (
        <Alert severity="error">
          Error:
          <pre>
            <code>{JSON.stringify(decodedConnectionError, null, 2)}</code>
          </pre>
        </Alert>
      )}
      <VerifiedUsers 
        data={data?.currentUser?.verified_users} 
        onDisconnect={onDisconnect}
      />
    </Container>
  )
}

export default withSignedIn(ConnectionTest)
