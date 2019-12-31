import React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirectTo from "/lib/redirect"

export default function withSignedOut(redirect = "/") {
  return (Component: any) => {
    return class WithSignedOut extends React.Component {
      static displayName = `withSignedOut(${Component.displayName ??
        "Component"})`

      static async getInitialProps(context: NextContext) {
        if (isSignedIn(context)) {
          redirectTo(context, redirect)
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
}
