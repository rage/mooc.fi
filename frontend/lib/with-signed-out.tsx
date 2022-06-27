import { PropsWithChildren, useContext } from "react"

import { NextPageContext as NextContext } from "next"
import { useRouter } from "next/router"

import LoginStateContext from "/contexts/LoginStateContext"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import prependLocale from "/util/prependLocale"

interface WithSignedOutProps {
  signedIn: boolean
}

// TODO: add more redirect parameters?
export default function withSignedOut(target = "/") {
  return (Component: any) => {
    function WithSignedOut(props: PropsWithChildren<WithSignedOutProps>) {
      const { loggedIn } = useContext(LoginStateContext)
      const { locale } = useRouter()

      if (props.signedIn) {
        return <div>Redirecting...</div>
      }

      if (loggedIn) {
        redirect({
          target: prependLocale(target, locale),
        })
      }
      return <Component {...props}>{props.children}</Component>
    }

    WithSignedOut.displayName = `withSignedOut(${
      Component.name || Component.displayName || "AnonymousComponent"
    })`

    WithSignedOut.getInitialProps = async (context: NextContext) => {
      const signedIn = isSignedIn(context)

      if (signedIn) {
        redirect({
          context,
          target: prependLocale(target, context.locale),
          shallow: false,
        })
      }

      return {
        ...(await Component.getInitialProps?.(context)),
        signedIn,
      }
    }

    return WithSignedOut
  }
}
