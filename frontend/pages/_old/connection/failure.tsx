import React from "react"

import { Container, Typography } from "@mui/material"

import withSignedIn from "/lib/with-signed-in"

function ConnectionFailure() {
  return (
    <Container>
      <Typography component="h1" variant="h1">
        Connecting your account failed
      </Typography>
    </Container>
  )
}

export default withSignedIn(ConnectionFailure)
