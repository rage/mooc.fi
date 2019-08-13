import * as React from "react"
import Container from "/components/Container"
import { Card, Typography, Link } from "@material-ui/core"
import styled from "styled-components"
import { NextPageContext } from "next"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import AdminError from "/components/Dashboard/AdminError"

const StyledCard = styled(Card)`
  width: 100%;
  height: 100px;
  margin: 1rem;
`

const Admin = (admin: boolean) => {
  if (!admin) {
    return <AdminError />
  }

  return (
    <Container>
      <Link href="/courses">
        <StyledCard>
          <Typography variant="h2" component="h2">
            Courses
          </Typography>
        </StyledCard>
      </Link>
      <Link href="/study-modules">
        <StyledCard>
          <Typography variant="h2" component="h2">
            Study Modules
          </Typography>
        </StyledCard>
      </Link>
      <Link href="/users/search">
        <StyledCard>
          <Typography variant="h2" component="h2">
            User search
          </Typography>
        </StyledCard>
      </Link>
    </Container>
  )
}

Admin.getInitialProps = function(context: NextPageContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["admin"],
  }
}

export default Admin
