import Router from "next/router"

import { useApolloClient } from "@apollo/client"

import { RegularContainer } from "/components/Container"
import CreateAccountForm from "/components/CreateAccountForm"
import { useAlertContext } from "/contexts/AlertContext"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useTranslator } from "/hooks/useTranslator"
import withSignedOut from "/lib/with-signed-out"
import SignUpTranslations from "/translations/sign-up"

const SignUpPage = () => {
  const t = useTranslator(SignUpTranslations)
  const apollo = useApolloClient()

  useBreadcrumbs([
    {
      translation: "signUp",
      href: "/_new/sign-up",
    },
  ])

  const { addAlert } = useAlertContext()
  const { logInOrOut } = useLoginStateContext()

  const onStepComplete = () => {
    logInOrOut()
    Router.push(`/_new/confirm-email`)

    addAlert({
      title: t("confirmEmailTitle"),
      message: t("confirmEmailInfo"),
      severity: "info",
      ignorePages: [Router.pathname, "/_new/confirm-email"],
    })
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
  }

  return (
    <div>
      <RegularContainer>
        <CreateAccountForm onComplete={onStepComplete} apollo={apollo} />
      </RegularContainer>
    </div>
  )
}

export default withSignedOut("/_new")(SignUpPage)
