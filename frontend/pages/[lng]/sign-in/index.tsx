import { Paper, Typography, Button } from "@material-ui/core"
import SignInForm from "/components/SignInForm"
import Container from "/components/Container"
import SignInTranslations from "/translations/common"
import styled from "@emotion/styled"
import withSignedOut from "/lib/with-signed-out"
import { useTranslator } from "/util/useTranslator"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { isProduction } from "/config"
import { useLanguageContext } from "/contexts/LanguageContext"

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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  button:not(:last-child) {
    margin-bottom: 0.5rem;
  }
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
          <ButtonContainer>
            <Link href={HY_SIGNIN_URL}>
              <Button
                color="primary"
                startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
              >
                Login using HY credentials
              </Button>
            </Link>
            <Link href={HAKA_SIGNIN_URL}>
              <Button
                color="secondary"
                startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
              >
                Login using Haka credentials
              </Button>
            </Link>
          </ButtonContainer>
        </StyledPaper>
      </Container>
    </>
  )
}

//If user is already logged in, redirect them straight to
//register-completion page
export default withSignedOut()(SignInPage)
