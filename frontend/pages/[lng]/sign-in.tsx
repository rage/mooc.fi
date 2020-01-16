import * as React from "react"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import SignInForm from "/components/SignInForm"
import Container from "/components/Container"
import LanguageContext from "/contexes/LanguageContext"
import getSignInTranslator from "/translations/common"
import { useContext } from "react"
import styled from "styled-components"
import withSignedOut from "/lib/with-signed-out"

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
    <>
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
    </>
  )
}

SignInPage.displayName = "SignInPage"

//If user is already logged in, redirect them straight to
//register-completion page
export default withSignedOut()(SignInPage)
