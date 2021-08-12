import { Component as ReactComponent } from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirectTo from "/lib/redirect"
import LoginStateContext from "/contexts/LoginStateContext"

// TODO: add more redirect parameters?
export default function withSignedOut(redirect = "/") {
  return (Component: any) => {
    return class WithSignedOut extends ReactComponent<{ signedIn: boolean }> {
      static displayName = `withSignedOut(${
        Component.name || Component.displayName || "AnonymousComponent"
      })`

      static contextType = LoginStateContext

      static async getInitialProps(context: NextContext) {
        const originalProps = await Component.getInitialProps?.(context)

        const signedIn = isSignedIn(context)

        if (signedIn) {
          redirectTo({
            context,
            target: redirect,
            shallow: false,
          })
        }

        return {
          ...originalProps,
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
