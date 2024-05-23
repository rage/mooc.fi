import { PropsWithChildren, Component as ReactComponent } from "react"

import { NextComponentType, NextPageContext as NextContext } from "next"

import { LoginStateContext } from "/contexts/LoginStateContext"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"

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
    static displayName = `withSignedIn(${Component.name ?? Component.displayName ?? "AnonymousComponent"
      })`
    static contextType = LoginStateContext


    render() {
      if (!isSignedIn(null)) {
        return <div>Redirecting...</div>
      }

      redirect({
        context: null,
        target: `${this.props.baseUrl}/sign-in`,
      })

      // We don't return here because when logging out it is better to keep the old content for a moment
      // than flashing a message while the redirect happens
      // return <div>You've logged out.</div>


      return <Component {...this.props}> {this.props.children}</Component >
    }
  }
}
