import React from "react"
import Container from "/components/Container"
import PointsList from "/components/User/Points/PointsList"
import { H1NoBackground } from "/components/Text/headers"
import withSignedIn from "/lib/with-signed-in"

function Points() {
  return (
    <section>
      <Container>
        <H1NoBackground variant="h1" component="h1" align="center">
          Points
        </H1NoBackground>
        <PointsList />
      </Container>
    </section>
  )
}

Points.displayName = "Points"

export default withSignedIn(Points)
