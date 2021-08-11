import { useContext } from "react"

import CreateAccountForm from "/components/SignUp/CreateAccountForm"

import withSignedOut from "/lib/with-signed-out"
import AlertContext from "/contexts/AlertContext"
import { useLanguageContext } from "/contexts/LanguageContext"
import SignUpTranslations from "/translations/sign-up"
import LoginStateContext from "/contexts/LoginStateContext"
import Router from "next/router"
import { useTranslator } from "/util/useTranslator"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import React from "react"
import { RegularContainer } from "/components/Container"
import styled from "@emotion/styled"
import { isProduction } from "/config"
import { faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@material-ui/core"
import Link from "next/link"

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  button:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

const SignUpPage = () => {
  const { language } = useLanguageContext()
  const t = useTranslator(SignUpTranslations)

  useBreadcrumbs([
    {
      translation: "signUp",
      href: "/sign-up",
    },
  ])

  const { addAlert } = useContext(AlertContext)
  const { logInOrOut } = useContext(LoginStateContext)

  const HY_SIGNUP_URL = isProduction
    ? `/sign-up/hy?language=${language}`
    : `http://localhost:5000/sign-up/hy?language=${language}`
  const HAKA_SIGNUP_URL = isProduction
    ? `/sign-up/haka?language=${language}`
    : `http://localhost:5000/sign-up/haka?language=${language}`

  const onStepComplete = () => {
    logInOrOut()
    Router.push(`/${language}/research-consent`)

    addAlert({
      title: t("confirmEmailTitle"),
      message: t("confirmEmailInfo"),
      severity: "info",
      ignorePages: [Router.pathname, "/[lng]/research-consent"],
    })
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
  }

  return (
    <div>
      <RegularContainer>
        <CreateAccountForm onComplete={onStepComplete} />
        <ButtonContainer>
          <Link href={HY_SIGNUP_URL}>
            <Button
              color="primary"
              startIcon={<FontAwesomeIcon icon={faUserPlus} />}
            >
              Register using HY credentials
            </Button>
          </Link>
          <Link href={HAKA_SIGNUP_URL}>
            <Button
              color="secondary"
              startIcon={<FontAwesomeIcon icon={faUserPlus} />}
            >
              Register using Haka credentials
            </Button>
          </Link>
        </ButtonContainer>
      </RegularContainer>
    </div>
  )
}

export default withSignedOut()(SignUpPage)
