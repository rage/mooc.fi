import React, { useContext } from "react"
import { RegularContainer } from "/components/Container"
import SignUpError from "/components/SignUp/SignUpError"
import { useQueryParameter } from "/util/useQueryParameter"
import LoginStateContext from "/contexts/LoginStateContext"

function SignUpErrorPage() {
  const type = useQueryParameter("type", false)
  const email = useQueryParameter("email", false)

  const { currentUser } = useContext(LoginStateContext)

  console.log("type", type)
  return (
    <div>
      <RegularContainer>
        <SignUpError type={type as any} email={currentUser?.email ?? email} />
      </RegularContainer>
    </div>
  )
}

export default SignUpErrorPage
