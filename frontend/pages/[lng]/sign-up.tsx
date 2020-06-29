import React, { useContext } from "react"

import CreateAccountForm from "/components/CreateAccountForm"

import { RegularContainer } from "/components/Container"
import withSignedOut from "/lib/with-signed-out"
import AlertContext from "/contexes/AlertContext"
import LanguageContext from "/contexes/LanguageContext"
import getSignUpTranslator from "/translations/sign-up"
import LoginStateContext from "/contexes/LoginStateContext"
import Router from "next/router"

const SignUpPage = () => {
  const { language } = useContext(LanguageContext)
  const t = getSignUpTranslator(language)

  const { addAlert } = useContext(AlertContext)
  const { logInOrOut } = useContext(LoginStateContext)

  const onStepComplete = () => {
    logInOrOut()
    Router.push("/[lng]/research-consent", `/${language}/research-consent`)

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
      </RegularContainer>
    </div>
  )
}

export default withSignedOut()(SignUpPage)
