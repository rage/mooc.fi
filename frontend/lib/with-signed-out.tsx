import { PropsWithChildren } from "react"

import { NextPageContext as NextContext } from "next"

import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"

// TODO: add more redirect parameters?
export default function withSignedOut(target = "/") {
  return (Component: any) => {
    function WithSignedOut(props: PropsWithChildren<{ signedIn: boolean }>) {
      if (props.signedIn) {
        return <div>Redirecting...</div>
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
          target,
          shallow: false,
        })

        return {
          signedIn: true,
        }
      }

      return {
        ...(await Component.getInitialProps?.(context)),
        signedIn,
      }
    }

    return WithSignedOut
  }
}
