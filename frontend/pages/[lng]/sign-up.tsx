import React, { useState } from "react"

import CreateAccountForm from "/components/CreateAccountForm"
import ConfirmEmail from "/components/ConfirmEmail"

import { RegularContainer } from "/components/Container"
import { NextPageContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"

const SignUpPage = () => {
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
    stepComponent = <ConfirmEmail onComplete={onStepComplete} />
  }

  return (
    <div>
      <RegularContainer>{stepComponent}</RegularContainer>
    </div>
  )
}

SignUpPage.getInitialProps = function(context: NextPageContext) {
  if (isSignedIn(context)) {
    redirect(context, "/")
  }
  return {}
}

export default SignUpPage
