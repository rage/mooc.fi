import { isSignedIn } from "/lib/authentication"
import redirectTo from "/lib/redirect"
import { NextPageContext as NextContext } from "next"
import { Component as ReactComponent, PropsWithChildren } from "react"

// TODO: add more redirect parameters?
export default function withSignedOut(redirect = "/") {
  return (Component: any) => {
    return class WithSignedOut extends ReactComponent<
      PropsWithChildren<{ signedIn: boolean }>
    > {
      static displayName = `withSignedOut(${
        Component.name || Component.displayName || "AnonymousComponent"
      })`

      static async getInitialProps(context: NextContext) {
        const signedIn = isSignedIn(context)

        if (signedIn) {
          redirectTo({
            context,
            target: redirect,
            shallow: false,
          })
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
