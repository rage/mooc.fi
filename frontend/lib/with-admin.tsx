import { PropsWithChildren, useContext } from "react"

import { NextPageContext as NextContext } from "next"

import AdminError from "/components/Dashboard/AdminError"
import { LoginStateContext } from "/contexts/LoginStateContext"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"

let prevContext: NextContext | null = null

interface WithAdminProps {
  admin: boolean
  signedIn: boolean
}

export default function withAdmin(Component: any) {
  function WithAdmin(props: PropsWithChildren<WithAdminProps>) {
    const ctx = useContext(LoginStateContext)
    // Needs to be before context check so that we don't redirect twice
    if (!props.signedIn) {
      return <div>Redirecting...</div>
    }

    // Logging out is communicated with a context change
    if (!ctx.loggedIn) {
      if (prevContext) {
        redirect({
          context: prevContext,
          target: "/sign-in",
        })
      }
      // We don't return here because when logging out it is better to keep the old content for a moment
      // than flashing a message while the redirect happens
      // return <div>You've logged out.</div>
    }

    if (!props.admin) {
      return <AdminError />
    }

    return <Component {...props}>{props.children}</Component>
  }
  WithAdmin.displayName = `withAdmin(${
    Component.displayName || Component.name || "AnonymousComponent"
  })`

  WithAdmin.getInitialProps = async (context: NextContext) => {
    const admin = isAdmin(context)
    const signedIn = isSignedIn(context)

    prevContext = context

    if (!signedIn) {
      redirect({
        context,
        target: "/sign-in",
      })

      return { admin: false, signedIn: false }
    }

    return {
      ...(await Component.getInitialProps?.(context)),
      admin,
      signedIn,
    }
  }

  return WithAdmin
}
