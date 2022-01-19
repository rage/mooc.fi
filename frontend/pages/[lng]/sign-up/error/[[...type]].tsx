import React, { useContext } from "react"

import { RegularContainer } from "/components/Container"
import SignUpError from "/components/SignUp/SignUpError"
import LoginStateContext from "/contexts/LoginStateContext"
import { useQueryParameter } from "/util/useQueryParameter"

function SignUpErrorPage() {
  const type = useQueryParameter("type", false)
  const email = useQueryParameter("email", false)

  const { currentUser } = useContext(LoginStateContext)

  return (
    <div>
      <RegularContainer>
        <SignUpError type={type as any} email={currentUser?.email ?? email} />
      </RegularContainer>
    </div>
  )
}

export default SignUpErrorPage
