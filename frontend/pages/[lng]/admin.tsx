import * as React from "react"
import Container from "/components/Container"
import { Card, CardHeader, Typography } from "@material-ui/core"
import styled from "styled-components"
import { NextPageContext } from "next"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import AdminError from "/components/Dashboard/AdminError"
import LanguageContext from "/contexes/LanguageContext"
import { useContext } from "react"
import DashboardBreadCrumbs from "/components/Dashboard/DashboardBreadCrumbs"
import ImageBanner from "/components/Home/ImageBanner"
import LangLink from "/components/LangLink"
const highlightsBanner = "/static/images/backgroundPattern.svg"

const StyledCard = styled(Card)<ColorProps>`
  margin: 1rem;
  ${props => `background-color:${props.color};`}
  color: white;
`
const CardListContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
`

interface ColorProps {
  color: string
}
const ColorWord = styled.span<ColorProps>`
  ${props => `color:${props.color};`}
`

function AdminPanelLinkCard({
  title,
  link,
  color,
}: {
  title: string
  link: string
  color: string
}) {
  const { language } = useContext(LanguageContext)
  return (
    <LangLink href={`/[lng]/${link}`} as={`/${language}/${link}`}>
      <StyledCard color={color}>
        <CardHeader title={title} />
      </StyledCard>
    </LangLink>
  )
}
const Admin = (admin: boolean) => {
  if (!admin) {
    return <AdminError />
  }

  return (
    <>
      <DashboardBreadCrumbs />
      <ImageBanner title="Admin panel" image={highlightsBanner} />
      <Container>
        <Typography variant="body1" component="p" paragraph>
          From <ColorWord color="#00A68D">Courses</ColorWord> you find list of
          all courses currently available at mooc.fi, and can access the
          dashboard of an individual course and create new courses.
        </Typography>
        <Typography variant="body1" component="p" paragraph>
          From <ColorWord color="#354B45">Study Modules</ColorWord> you find a
          list of all study modules currently available at mooc.fi, and can
          access the dashboard of an individual study module and create new
          study modules.
        </Typography>
        <Typography variant="body1" component="p" paragraph>
          <ColorWord color="#97B0AA">User search</ColorWord> allows you to
          search for students to access their points and completions data.
        </Typography>
        <CardListContainer>
          <AdminPanelLinkCard link="courses" title="Courses" color="#00A68D" />
          <AdminPanelLinkCard
            link="study-modules"
            title="Study Modules"
            color="#354B45"
          />
          <AdminPanelLinkCard
            link="/users/search"
            title="User search"
            color="#97B0AA"
          />
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
