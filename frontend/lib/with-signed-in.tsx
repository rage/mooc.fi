import { PropsWithChildren, useContext } from "react"

import { NextPageContext as NextContext } from "next"
import { useRouter } from "next/router"

import LoginStateContext from "/contexts/LoginStateContext"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import prependLocale from "/util/prependLocale"

interface WithSignedInProps {
  signedIn: boolean
}

export default function withSignedIn(Component: any) {
  function WithSignedIn(props: PropsWithChildren<WithSignedInProps>) {
    const { loggedIn } = useContext(LoginStateContext)
    const { locale } = useRouter()
    const { signedIn } = props

    if (!signedIn) {
      return <div>Redirecting...</div>
    }

    if (!loggedIn) {
      redirect({
        // ...(prevContext ? { context: prevContext } : {}),
        // context: prevContext, // ?? (this.context as NextContext),
        target: prependLocale("/sign-in", locale),
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

    if (!signedIn) {
      redirect({
        context,
        target: prependLocale("/sign-in", context.locale),
      })

      return await Component.getInitialProps?.(context)
    }

    return {
      ...(await Component.getInitialProps?.(context)),
      signedIn,
    }
  }

  return WithSignedIn
}
