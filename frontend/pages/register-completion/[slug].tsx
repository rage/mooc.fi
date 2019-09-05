import React from "react"
import { NextPageContext as NextContext } from "next"
import redirect from "/lib/redirect"

const RegisterCompletionDefault = () => {
  return <div>Redirecting...</div>
}

RegisterCompletionDefault.getInitialProps = function(context: NextContext) {
  const { query } = context

  redirect(context, `/register-completion/${query.slug}`)

  return {}
}

export default RegisterCompletionDefault
