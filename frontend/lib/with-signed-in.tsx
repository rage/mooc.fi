import LoginStateContext from "/contexts/LoginStateContext"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import { NextPageContext as NextContext } from "next"
import { Component as ReactComponent, PropsWithChildren } from "react"

let prevContext: NextContext | null = null

// TODO: might need to wrap in function to give redirect parameters (= shallow?)
export default function withSignedIn(Component: any) {
  return class WithSignedIn extends ReactComponent<
    PropsWithChildren<{ signedIn: boolean }>
  > {
    static displayName = `withSignedIn(${
      Component.name || Component.displayName || "AnonymousComponent"
    })`
    static contextType = LoginStateContext

    static async getInitialProps(context: NextContext) {
      const signedIn = isSignedIn(context)

      prevContext = context

      if (!signedIn) {
        redirect({
          context,
          target: "/sign-in",
        })

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
      if (!(this.context as any).loggedIn) {
        if (prevContext) {
          redirect({
            context: prevContext,
            target: "/sign-in",
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
