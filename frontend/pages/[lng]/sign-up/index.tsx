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
import { isProduction } from "/config"
import OrganizationButtons from "/components/OrganizationButtons"

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
        <OrganizationButtons
          hyURL={HY_SIGNUP_URL}
          hakaURL={HAKA_SIGNUP_URL}
          hyCaption="Sign up using University of Helsinki credentials"
          hakaCaption="Sign up using other organization credentials"
          hyVisible
        />
      </RegularContainer>
    </div>
  )
}

export default withSignedOut()(SignUpPage)
