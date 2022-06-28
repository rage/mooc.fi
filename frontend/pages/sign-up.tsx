import { RegularContainer } from "/components/Container"
import CreateAccountForm from "/components/CreateAccountForm"
import AlertContext from "/contexts/AlertContext"
import LoginStateContext from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedOut from "/lib/with-signed-out"
import SignUpTranslations from "/translations/sign-up"
import { useTranslator } from "/util/useTranslator"
import Router from "next/router"
import { useContext } from "react"

const SignUpPage = () => {
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
    Router.push(`/research-consent`)

    addAlert({
      title: t("confirmEmailTitle"),
      message: t("confirmEmailInfo"),
      severity: "info",
      ignorePages: [Router.pathname, "/research-consent"],
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
