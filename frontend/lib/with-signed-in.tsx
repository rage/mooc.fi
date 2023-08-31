import { PropsWithChildren, Component as ReactComponent } from "react"

import { NextComponentType, NextPageContext as NextContext } from "next"

import { LoginStateContext } from "/contexts/LoginStateContext"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"

let prevContext: NextContext | null = null

// TODO: might need to wrap in function to give redirect parameters (= shallow?)
export default function withSignedIn(
  Component: NextComponentType<
    any,
    any,
    { signedIn: boolean; baseUrl?: string }
  >,
) {
  return class WithSignedIn extends ReactComponent<
    PropsWithChildren<{ signedIn: boolean; baseUrl?: string }>
  > {
    static displayName = `withSignedIn(${
      Component.name || Component.displayName || "AnonymousComponent"
    })`
    static contextType = LoginStateContext

    static async getInitialProps(context: NextContext) {
      const signedIn = isSignedIn(context)
      const baseUrl = context.pathname.includes("_new") ? "/_new" : ""
      prevContext = context

      if (!signedIn) {
        redirect({
          context,
          target: `${baseUrl}/sign-in`,
        })

        return { baseUrl }
      }

      return {
        ...(await Component.getInitialProps?.(context)),
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

      return <Component {...this.props}>{this.props.children}</Component>
    }
  }
}
