import React, { useContext } from "react"

import { RegularContainer } from "/components/Container"
import OrganizationButtons from "/components/OrganizationButtons"
import CreateAccountForm from "/components/SignUp/CreateAccountForm"
import SignUpError from "/components/SignUp/SignUpError"
import { isProduction } from "/config"
import AlertContext from "/contexts/AlertContext"
import { useLanguageContext } from "/contexts/LanguageContext"
import LoginStateContext from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedOut from "/lib/with-signed-out"
import SignUpTranslations from "/translations/sign-up"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"
import Router from "next/router"

const SignUpPage = () => {
  const { language } = useLanguageContext()
  const { currentUser } = useContext(LoginStateContext)

  const t = useTranslator(SignUpTranslations)
  const error = useQueryParameter("error", false)
  const email = useQueryParameter("email", false)

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
        {error && (
          <SignUpError
            type={error as any}
            email={currentUser?.email ?? email}
          />
        )}
        <CreateAccountForm onComplete={onStepComplete} />
        <OrganizationButtons
          hyURL={HY_SIGNUP_URL}
          hakaURL={HAKA_SIGNUP_URL}
          hyCaption={t("signupHYCaption")}
          hakaCaption={t("signupHakaCaption")}
        />
      </RegularContainer>
    </div>
  )
}

export default withSignedOut()(SignUpPage)
