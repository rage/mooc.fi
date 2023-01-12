import { PropsWithChildren, useContext } from "react"

import { NextPageContext as NextContext } from "next"
import { useRouter } from "next/router"

import { LoginStateContext } from "/contexts/LoginStateContext"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"

let prevContext: NextContext | null = null

// TODO: might need to wrap in function to give redirect parameters (= shallow?)
export default function withSignedIn(Component: any) {
  function WithSignedIn(props: PropsWithChildren<{ signedIn: boolean }>) {
    const ctx = useContext(LoginStateContext)
    const router = useRouter()

    // Needs to be before context check so that we don't redirect twice
    if (!props.signedIn) {
      return <div>Redirecting...</div>
    }

    // Logging out is communicated with a context change
    if (!ctx.loggedIn) {
      const newContext = prevContext ?? ({} as NextContext)
      redirect({
        context: newContext,
        locale: newContext.locale ?? router.locale,
        target: "/sign-in",
      })
      // We don't return here because when logging out it is better to keep the old content for a moment
      // than flashing a message while the redirect happens
      // return <div>You've logged out.</div>
    }

    return <Component {...props}>{props.children}</Component>
  }

  WithSignedIn.displayName = `withSignedIn(${
    Component.name || Component.displayName || "AnonymousComponent"
  })`

  WithSignedIn.getInitialProps = async (context: NextContext) => {
    const signedIn = isSignedIn(context)

    prevContext = context

    if (!signedIn) {
      redirect({
        context,
        target: "/sign-in",
      })

      return {
        signedIn: false,
      }
    }

    return {
      ...(await Component.getInitialProps?.(context)),
      signedIn,
    }
  }

  return WithSignedIn
}
