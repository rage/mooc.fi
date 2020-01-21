import React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import LoginStateContext from "/contexes/LoginStateContext"

let prevContext: NextContext | null = null

// TODO: might need to wrap in function to give redirect parameters (= shallow?)
export default function withSignedIn(Component: any) {
  return class WithSignedIn extends React.Component<{ signedIn: boolean }> {
    static displayName = `withSignedIn(${Component.name ||
      Component.displayName ||
      "AnonymousComponent"})`
    static contextType = LoginStateContext

    static async getInitialProps(context: NextContext) {
      const signedIn = isSignedIn(context)

      prevContext = context

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
      // Needs to be before context check so that we don't redirect twice
      if (!this.props.signedIn) {
        return <div>Redirecting...</div>
      }

      // Logging out is communicated with a context change
      if (!this.context.loggedIn) {
        if (prevContext) {
          redirect(prevContext, "/sign-in")
        }
        // We don't return here because when logging out it is better to keep the old content for a moment
        // than flashing a message while the redirect happens
        // return <div>You've logged out.</div>
      }

      return <Component {...this.props}>{this.props.children}</Component>
    }
  }
}
