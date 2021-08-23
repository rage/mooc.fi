import { Paper, Typography, Button } from "@material-ui/core"
import SignInForm from "/components/SignInForm"
import Container from "/components/Container"
import SignInTranslations from "/translations/common"
import styled from "@emotion/styled"
import withSignedOut from "/lib/with-signed-out"
import { useTranslator } from "/util/useTranslator"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import React from "react"
import { isProduction } from "/config"
import { useLanguageContext } from "/contexts/LanguageContext"
import OrganizationButtons from "/components/OrganizationButtons"

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
  const { language } = useLanguageContext()

  const HY_SIGNIN_URL = isProduction
    ? `/sign-in/hy?language=${language}`
    : `http://localhost:5000/sign-in/hy?language=${language}`
  const HAKA_SIGNIN_URL = isProduction
    ? `/sign-in/haka?language=${language}`
    : `http://localhost:5000/sign-in/haka?language=${language}`

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
          <OrganizationButtons
            hyURL={HY_SIGNIN_URL}
            hakaURL={HAKA_SIGNIN_URL}
            hyVisible
          />
        </StyledPaper>
      </Container>
    </>
  )
}

//If user is already logged in, redirect them straight to
//register-completion page
export default withSignedOut()(SignInPage)
