import React from "react"
import { RegularContainer } from "/components/Container"
import SignUpError from "/components/SignUp/SignUpError"
import { useQueryParameter } from "/util/useQueryParameter"

function SignUpErrorPage() {
  const type = useQueryParameter("type", false)

  return (
    <div>
      <RegularContainer>
        <SignUpError type={type} />
      </RegularContainer>
    </div>
  )
}

export default SignUpErrorPage
