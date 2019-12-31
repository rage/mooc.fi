import React from "react"
import { NextPageContext as NextContext } from "next"
import { isAdmin, isSignedIn } from "/lib/authentication"
import AdminError from "/components/Dashboard/AdminError"
import redirect from "/lib/redirect"

export default function withAdmin(Component: any) {
  return class WithAdmin extends React.Component<{
    admin: boolean
    signedIn: boolean
  }> {
    static displayName = `withAdmin(${Component.displayName ?? "Component"})`

    static async getInitialProps(context: NextContext) {
      const admin = isAdmin(context)
      const signedIn = isSignedIn(context)

      if (!signedIn) {
        redirect(context, "/sign-in")

        return {}
      }

      return {
        ...(await Component.getInitialProps?.(context)),
        admin,
        signedIn,
      }
    }

    render() {
      if (!this.props.admin) {
        return <AdminError />
      }

      if (!this.props.signedIn) {
        return <div>Redirecting...</div>
      }

      return <Component {...this.props}>{this.props.children}</Component>
    }
  }
}
