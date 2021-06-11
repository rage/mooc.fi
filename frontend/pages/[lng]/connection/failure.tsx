import { Container, Typography } from "@material-ui/core"
import React from "react"
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
