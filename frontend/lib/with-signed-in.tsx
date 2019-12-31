import React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"

export default function withSignedIn(Component: any) {
  return class WithSignedIn extends React.Component {
    static displayName = `withSignedIn(${Component.displayName ?? "Component"})`

    static async getInitialProps(context: NextContext) {
      if (!isSignedIn(context)) {
        redirect(context, "/sign-in")
      }

      return {
        ...(await Component.getInitialProps?.(context)),
      }
    }

    render() {
      return <Component {...this.props}>{this.props.children}</Component>
    }
  }
}
