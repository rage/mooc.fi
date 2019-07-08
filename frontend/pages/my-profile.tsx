import React, { useEffect, useState } from "react"
import NextI18Next from "../i18n"
import { isSignedIn, userDetails } from "../lib/authentication"
import { NextContext } from "next"
import redirect from "../lib/redirect"

function MyProfile() {
  return <div>UNDER CONSTRUCTION</div>
}

MyProfile.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    namespacesRequired: ["register-completion"],
  }
}

export default MyProfile
