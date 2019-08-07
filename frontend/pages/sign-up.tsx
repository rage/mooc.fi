import React, { useState } from "react"

import CreateAccountForm from "../components/CreateAccountForm"
import ConfirmEmail from "../components/ConfirmEmail"

import Container from "../components/Container"
import { NextPageContext } from "next"
import { isSignedIn } from "../lib/authentication"
import redirect from "../lib/redirect"
import NextI18Next from "../i18n"

interface SignUpPageProps {
  t: Function
}

const SignUpPage = (props: SignUpPageProps) => {
  const { t } = props

  const [state, setState] = useState({
    step: 1,
  })

  const onStepComplete = () => {
    setState((prevState: any) => ({
      step: prevState.step + 1,
    }))
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
  }
  let stepComponent
  if (state.step === 1) {
    stepComponent = <CreateAccountForm onComplete={onStepComplete} />
  } else {
    stepComponent = <ConfirmEmail onComplete={onStepComplete} t={t} />
  }

  return (
    <div>
      <Container>{stepComponent}</Container>
    </div>
  )
}

SignUpPage.getInitialProps = function(context: NextPageContext) {
  if (isSignedIn(context)) {
    redirect(context, "/")
  }
  return {
    namespacesRequired: ["sign-up"],
  }
}

export default NextI18Next.withTranslation("sign-up")(SignUpPage)
