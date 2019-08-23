import * as React from "react"
import Container from "/components/Container"
import { Card, Typography, Link } from "@material-ui/core"
import styled from "styled-components"
import { NextPageContext } from "next"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import AdminError from "/components/Dashboard/AdminError"
import LanguageContext from "/contexes/LanguageContext"
import { useContext } from "react"

const StyledCard = styled(Card)`
  width: 100%;
  height: 100px;
  margin: 1rem;
`

const Admin = (admin: boolean) => {
  if (!admin) {
    return <AdminError />
  }
  const { language } = useContext(LanguageContext)
  return (
    <Container>
      <Link href={`/${language}/courses`}>
        <StyledCard>
          <Typography variant="h2" component="h2">
            Courses
          </Typography>
        </StyledCard>
      </Link>
      <Link href={`/${language}/study-modules`}>
        <StyledCard>
          <Typography variant="h2" component="h2">
            Study Modules
          </Typography>
        </StyledCard>
      </Link>
      <Link href={`/${language}/users/search`}>
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
  }
}

export default Admin
