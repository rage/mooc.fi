import * as React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import SignInForm from "/components/SignInForm"
import Container from "/components/Container"
import LanguageContext from "/contexes/LanguageContext"
import getSignInTranslator from "/translations/common"
import { useContext } from "react"
import styled from "styled-components"

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  margin-top: 2em;
  margin-bottom: 2em;
`
const Header = styled(Typography)`
  margin: 1em;
`
const SignInPage = () => {
  const lng = useContext(LanguageContext)
  const t = getSignInTranslator(lng.language)
  return (
    <Container style={{ width: "90%", maxWidth: 900 }}>
      <StyledPaper>
        <Header component="h1" variant="h4" gutterBottom={true}>
          {t("login")}
        </Header>
        <Typography component="p" paragraph>
          {t("loginDetails")}
        </Typography>
        <SignInForm />
      </StyledPaper>
    </Container>
  )
}

//If user is already logged in, redirect them straight to
//register-completion page
SignInPage.getInitialProps = function(context: NextContext) {
  if (isSignedIn(context)) {
    redirect(context, "/")
  }
  return {}
}

export default SignInPage
