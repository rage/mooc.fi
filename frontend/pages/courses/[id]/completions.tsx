import React, { useState } from "react"
import { isSignedIn, isAdmin } from "../../../lib/authentication"
import redirect from "../../../lib/redirect"
import { NextPageContext as NextContext } from "next"
import AdminError from "../../../components/Dashboard/AdminError"
import CompletionsList from "../../../components/Dashboard/CompletionsList"

const Completions = ({ admin }: { admin: boolean }) => {
  if (!admin) {
    return <AdminError />
  }
  return <CompletionsList />
}

Completions.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default Completions
