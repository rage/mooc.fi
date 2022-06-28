import React from "react"

import { gql, useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import { Card, Typography } from "@mui/material"

import Container from "/components/Container"
import { formatDateTime } from "/components/DataFormatFunctions"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import { CardTitle } from "/components/Text/headers"
import withSignedIn from "/lib/with-signed-in"
import { ConnectedUser } from "/static/types/generated/ConnectedUser"

export const ConnectedUserQuery = gql`
  query ConnectedUser {
    currentUser {
      id
      upstream_id
      verified_users {
        id
        created_at
        updated_at
        display_name
        organization {
          id
          organization_translations {
            language
            name
          }
        }
      }
    }
  }
`

const ConnectionEntryCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

function ConnectionSuccess() {
  const { data, error, loading } = useQuery<ConnectedUser>(ConnectedUserQuery)

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
