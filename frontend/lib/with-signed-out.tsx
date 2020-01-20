import React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirectTo from "/lib/redirect"

// TODO: add more redirect parameters?
export default function withSignedOut(redirect = "/") {
  return (Component: any) => {
    return class WithSignedOut extends React.Component<{ signedIn: boolean }> {
      static displayName = `withSignedOut(${
        Component.displayName ?? "Component"
      })`

      static async getInitialProps(context: NextContext) {
        const signedIn = isSignedIn(context)

        if (signedIn) {
          redirectTo(context, redirect)
        }

        return {
          ...(await Component.getInitialProps?.(context)),
          signedIn,
        }
      }

      render() {
        if (this.props.signedIn) {
          return <div>Redirecting...</div>
        }

        return <Component {...this.props}>{this.props.children}</Component>
      }
    }
  }
}
