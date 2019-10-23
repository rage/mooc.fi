import React from "react"
import { isSignedIn } from "/lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "/lib/redirect"
import Container from "/components/Container"
import Title from "/components/User/Title"
import PointsList from "/components/User/Points/PointsList"

function Points() {
  return (
    <section>
      <Container>
        <Title titleText="Points" />
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
