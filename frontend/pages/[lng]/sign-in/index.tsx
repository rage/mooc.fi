import React from "react"

import Container from "/components/Container"
import OrganizationButtons from "/components/OrganizationButtons"
import SignInForm from "/components/SignInForm"
import { isProduction } from "/config"
import { useLanguageContext } from "/contexts/LanguageContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedOut from "/lib/with-signed-out"
import SignInTranslations from "/translations/common"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

import styled from "@emotion/styled"
import { Paper, Typography } from "@material-ui/core"

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

type SignInError =
  | "no-user-found"
  | "already-signed-in"
  | "auth-fail"
  | "unknown"

const SignInPage = () => {
  const t = useTranslator(SignInTranslations)
  const { language } = useLanguageContext()

  const error = useQueryParameter("error", false) as SignInError | undefined
  const message = useQueryParameter("message", false)

  const HY_SIGNIN_URL = isProduction
    ? `/sp/sign-in/hy?language=${language}`
    : `http://localhost:5000/sign-in/hy?language=${language}`
  const HAKA_SIGNIN_URL = isProduction
    ? `/sp/sign-in/haka?language=${language}`
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
            hyCaption={t("signinHYCaption")}
            hakaCaption={t("signinHakaCaption")}
            error={error ? t(`signinError_${error}`, { message }) : undefined}
          />
        </StyledPaper>
      </Container>
    </>
  )
}

//If user is already logged in, redirect them straight to
//register-completion page
export default withSignedOut()(SignInPage)
