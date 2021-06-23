import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client"
import { Alert } from "@material-ui/core"
import React from "react"
import Container from "/components/Container"
import ErrorMessage from "/components/ErrorMessage"
import VerifiedUsers from "/components/Profile/VerifiedUsers/VerifiedUsers"
import Spinner from "/components/Spinner"
import withSignedIn from "/lib/with-signed-in"
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
        organization {
          slug
          organization_translations {
            language
            name
          }
        }
        created_at
        personal_unique_code
        display_name
      }
    }
  }
`

function ConnectionTest() {
  const { data, error, loading } = useQuery(ConnectionTestQuery)
  const connectionSuccess = useQueryParameter("success", false)
  const connectionError = useQueryParameter("error", false)

  if (error) {
    return <ErrorMessage />
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Container style={{ maxWidth: 900 }}>
      {connectionSuccess && (
        <Alert severity="success">Connection successful!</Alert>
      )}
      {connectionError && (
        <Alert severity="error">
          Connection error:
          <pre>
            <code>{decodeURIComponent(connectionError)}</code>
          </pre>
        </Alert>
      )}
      <VerifiedUsers data={data?.currentUser?.verified_users} />
    </Container>
  )
}

export default withSignedIn(ConnectionTest)
