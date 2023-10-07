import React, { PropsWithChildren, Component as ReactComponent } from "react"

import { NextPageContext } from "next"

import AdminError from "/components/Dashboard/AdminError"
import { LoginStateContext } from "/contexts/LoginStateContext"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"

let prevContext: NextPageContext | null = null

function withAdmin(Component: any) {
  class WithAdmin extends ReactComponent<
    PropsWithChildren<{
      admin: boolean
      signedIn: boolean
      baseUrl?: string
    }>
  > {
    static displayName = `withAdmin(${
      Component.displayName || Component.name || "AnonymousComponent"
    })`
    static contextType = LoginStateContext

    static async getInitialProps(context: NextPageContext) {
      const admin = isAdmin(context)
      const signedIn = isSignedIn(context)
      const baseUrl = context.pathname.includes("_old") ? "/_old" : ""

      prevContext = context

      if (!signedIn) {
        redirect({
          context,
          target: `${baseUrl}/sign-in`,
        })

        return { signedIn: false, baseUrl }
      }

      return {
        ...(await Component.getInitialProps?.(context)),
        admin,
        signedIn,
        baseUrl,
      }
    }

    render() {
      // Needs to be before context check so that we don't redirect twice
      if (!this.props.signedIn) {
        return <div>Redirecting...</div>
      }

      // Logging out is communicated with a context change
      if (!(this.context as any).loggedIn) {
        if (prevContext) {
          redirect({
            context: prevContext,
            target: `${this.props.baseUrl}/sign-in`,
          })
        }
        // We don't return here because when logging out it is better to keep the old content for a moment
        // than flashing a message while the redirect happens
        // return <div>You've logged out.</div>
      }

      if (!this.props.admin) {
        return <AdminError />
      }

      return <Component {...this.props}>{this.props.children}</Component>
    }
  }

  return WithAdmin
}

export default withAdmin
