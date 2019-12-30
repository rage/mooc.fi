import React from "react"
import { NextPageContext as NextContext } from "next"
import { isAdmin, isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import AdminError from "/components/Dashboard/AdminError"

export default function withAdmin(Component: any) {
  return class WithAdmin extends React.Component<{ admin: boolean }> {
    static displayName = `withAdmin(${Component.displayName ?? "Component"})`

    static async getInitialProps(context: NextContext) {
      const admin = isAdmin(context)

      if (!isSignedIn(context)) {
        redirect(context, "/sign-in")
      }
      return {
        admin,
      }
    }

    render() {
      if (!this.props.admin) {
        return <AdminError />
      }

      return <Component>{this.props.children}</Component>
    }
  }
}
