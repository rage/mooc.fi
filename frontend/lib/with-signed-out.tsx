import { ComponentType, useEffect } from "react"

import { useRouter } from "next/router"

import { useAuth } from "/hooks/useAuth"

export default function withSignedOut(redirect = "/") {
  return <P extends object = object>(
    Component: ComponentType<P & { signedIn?: boolean }>,
  ) => {
    const WithSignedOut = (props: P) => {
      const router = useRouter()
      const { loading, signedIn } = useAuth()

      useEffect(() => {
        if (!loading && signedIn) {
          router.push(redirect)
        }
      }, [loading, signedIn, router])

      if (loading) {
        return <div>Loading...</div>
      }

      if (signedIn) {
        return <div>Redirecting...</div>
      }

      return <Component {...props} signedIn={signedIn} />
    }

    WithSignedOut.displayName = `withSignedOut(${
      Component.name ?? Component.displayName ?? "AnonymousComponent"
    })`

    return WithSignedOut
  }
}
