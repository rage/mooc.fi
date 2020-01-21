import React, { useState } from "react"

import CreateAccountForm from "/components/CreateAccountForm"
import ConfirmEmail from "/components/ConfirmEmail"

import { RegularContainer } from "/components/Container"
import withSignedOut from "/lib/with-signed-out"

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

  const stepComponent =
    state.step === 1 ? (
      <CreateAccountForm onComplete={onStepComplete} />
    ) : (
      <ConfirmEmail onComplete={onStepComplete} />
    )

  return (
    <div>
      <RegularContainer>{stepComponent}</RegularContainer>
    </div>
  )
}

export default withSignedOut()(SignUpPage)
