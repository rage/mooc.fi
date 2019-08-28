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
import DashboardBreadCrumbs from "/components/Dashboard/DashboardBreadCrumbs"
import ImageBanner from "/components/Home/ImageBanner"
const highlightsBanner = "/static/images/backgroundPattern.svg"

const StyledCard = styled(Card)`
  margin: 1rem;
  padding: 1rem;
`
const CardListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

const LinkTitle = styled(Typography)`
  @media (min-width: 350px) {
    font-size: 24px;
  }
`
const Admin = (admin: boolean) => {
  if (!admin) {
    return <AdminError />
  }
  const { language } = useContext(LanguageContext)
  return (
    <>
      <DashboardBreadCrumbs />
      <ImageBanner title="Admin dashboard" image={highlightsBanner} />
      <Container>
        <CardListContainer>
          <Link href={`/${language}/courses`}>
            <StyledCard>
              <LinkTitle variant="h3" component="h2">
                Courses
              </LinkTitle>
            </StyledCard>
          </Link>
          <Link href={`/${language}/study-modules`}>
            <StyledCard>
              <LinkTitle variant="h3" component="h2">
                Study Modules
              </LinkTitle>
            </StyledCard>
          </Link>
          <Link href={`/${language}/users/search`}>
            <StyledCard>
              <LinkTitle variant="h3" component="h2">
                User search
              </LinkTitle>
            </StyledCard>
          </Link>
        </CardListContainer>
      </Container>
    </>
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
