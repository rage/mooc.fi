import { Component as ReactComponent } from "react"
import { NextPageContext as NextContext } from "next"
import AdminError from "/components/Dashboard/AdminError"
import redirect from "/lib/redirect"
import LoginStateContext from "/contexts/LoginStateContext"
import { isAdmin, isSignedIn } from "/lib/authentication"

let prevContext: NextContext | null = null

export default function withAdmin(Component: any) {
  class WithAdmin extends ReactComponent<{
    admin: boolean
    signedIn: boolean
  }> {
    constructor(props: any) {
      super(props)
    }

    static displayName = `withAdmin(${
      Component.displayName || Component.name || "AnonymousComponent"
    })`
    static contextType = LoginStateContext

    static async getInitialProps(context: NextContext) {
      const originalProps = await Component.getInitialProps?.(context)

      const signedIn = isSignedIn(context)
      const admin = isAdmin(context)

      prevContext = context

      if (!signedIn) {
        redirect({
          context,
          target: "/sign-in",
        })
      }

      return {
        ...originalProps,
        admin,
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
          redirect({
            context: prevContext,
            target: "/sign-in",
          })
        }
        // We don't return here because when logging out it is better to keep the old content for a moment
        // than flashing a message while the redirect happens
        // return <div>You've logged out.</div>
      }

      if (!this.props.admin) {
        return <AdminError />
      }

      return <Component {...this.props}>{this.props.children}</Component>
    }
  }

  return WithAdmin
}
