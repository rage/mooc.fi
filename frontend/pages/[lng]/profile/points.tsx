import React from "react"
import { isSignedIn } from "/lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "/lib/redirect"
import Container from "/components/Container"
import PointsList from "/components/User/Points/PointsList"
import { H1NoBackground } from "/components/Text/headers"

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

Points.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {}
}

export default Points
