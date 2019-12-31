import React from "react"
import { NextPageContext as NextContext } from "next"
import { isAdmin } from "/lib/authentication"
import AdminError from "/components/Dashboard/AdminError"

export default function withAdmin(Component: any) {
  return class WithAdmin extends React.Component<{ admin: boolean }> {
    static displayName = `withAdmin(${Component.displayName ?? "Component"})`

    static async getInitialProps(context: NextContext) {
      const admin = isAdmin(context)

      return {
        ...(await Component.getInitialProps?.(context)),
        admin,
      }
    }

    render() {
      if (!this.props.admin) {
        return <AdminError />
      }

      return <Component {...this.props}>{this.props.children}</Component>
    }
  }
}
