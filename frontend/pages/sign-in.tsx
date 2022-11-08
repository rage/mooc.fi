import styled from "@emotion/styled"
import { Paper, Typography } from "@mui/material"

import Container from "/components/Container"
import SignInForm from "/components/SignInForm"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedOut from "/lib/with-signed-out"
import SignInTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  margin-top: 2em;
  margin-bottom: 2em;
`

const Header = styled(Typography)<any>`
  margin: 1em;
`

const SignInPage = () => {
  const t = useTranslator(SignInTranslations)

  useBreadcrumbs([
    {
      translation: "signIn",
      href: "/sign-in",
    },
  ])

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

//If user is already logged in, redirect them straight to
//register-completion page
export default withSignedOut()(SignInPage)
