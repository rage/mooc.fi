import React from "react"

import { useQuery } from "@apollo/client"
import { Alert } from "@mui/material"

import Container from "/components/Container"
import ErrorMessage from "/components/ErrorMessage"
import VerifiedUsers from "/components/Profile/VerifiedUsers/VerifiedUsers"
import Spinner from "/components/Spinner"
import { useQueryParameter } from "/hooks/useQueryParameter"
import withSignedIn from "/lib/with-signed-in"

import { ConnectionTestDocument } from "/graphql/generated"

function ConnectionTest() {
  const { data, error, loading } = useQuery(ConnectionTestDocument)
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

  return (
    <Container style={{ maxWidth: 900 }}>
      {connectionSuccess && (
        <Alert severity="success">Connection successful!</Alert>
      )}
      {connectionError && (
        <Alert severity="error">
          Connection error:
          <pre>
            <code>{JSON.stringify(decodedConnectionError, null, 2)}</code>
          </pre>
        </Alert>
      )}
      <VerifiedUsers data={data?.currentUser?.verified_users} />
    </Container>
  )
}

export default withSignedIn(ConnectionTest)
