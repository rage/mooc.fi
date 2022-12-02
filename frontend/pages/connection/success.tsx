import React from "react"

import { useQuery } from "@apollo/client"
import { Card, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import Container from "/components/Container"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import { CardTitle } from "/components/Text/headers"
import withSignedIn from "/lib/with-signed-in"
import { formatDateTime } from "/util/dataFormatFunctions"

import { ConnectedUserDocument } from "/graphql/generated"

const ConnectionEntryCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

function ConnectionSuccess() {
  const { data, error, loading } = useQuery(ConnectedUserDocument)

  if (error) {
    return <ErrorMessage />
  }
  if (loading) {
    return <Spinner />
  }

  return (
    <Container>
      <Typography component="h1" variant="h1">
        Connecting your account successful!
      </Typography>
      {data?.currentUser?.verified_users.map((verified_user) => (
        <ConnectionEntryCard>
          <CardTitle
            variant="h3"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            Organization:{" "}
            {verified_user.organization?.organization_translations?.[0]?.name}
            <Typography variant="h4">
              Registered: {formatDateTime(verified_user.created_at)}
            </Typography>
          </CardTitle>
        </ConnectionEntryCard>
      ))}
    </Container>
  )
}

export default withSignedIn(ConnectionSuccess)
