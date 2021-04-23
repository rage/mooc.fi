import { useContext } from "react"

import CreateAccountForm from "/components/CreateAccountForm"

import { RegularContainer } from "/components/Container"
import withSignedOut from "/lib/with-signed-out"
import AlertContext from "/contexts/AlertContext"
import LanguageContext from "/contexts/LanguageContext"
import SignUpTranslations from "/translations/sign-up"
import LoginStateContext from "/contexts/LoginStateContext"
import Router from "next/router"
import { useTranslator } from "/util/useTranslator"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

const SignUpPage = () => {
  const { language } = useContext(LanguageContext)
  const t = useTranslator(SignUpTranslations)

  useBreadcrumbs([
    {
      translation: "signUp",
      href: "/sign-up",
    },
  ])

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
