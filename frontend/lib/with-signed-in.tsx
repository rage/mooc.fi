import React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"

// TODO: might need to wrap in function to give redirect parameters (= shallow?)
export default function withSignedIn(Component: any) {
  return class WithSignedIn extends React.Component<{ signedIn: boolean }> {
    static displayName = `withSignedIn(${Component.displayName ?? "Component"})`

    static async getInitialProps(context: NextContext) {
      const signedIn = isSignedIn(context)

      if (!signedIn) {
        redirect(context, "/sign-in")

        return {}
      }

      return {
        ...(await Component.getInitialProps?.(context)),
        signedIn,
      }
    }

    render() {
      if (!this.props.signedIn) {
        return <div>Redirecting...</div>
      }

      return <Component {...this.props}>{this.props.children}</Component>
    }
  }
}
