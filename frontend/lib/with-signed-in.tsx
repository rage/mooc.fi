import { ComponentType, useEffect } from "react"

import { useRouter } from "next/router"

import { useAuth } from "/hooks/useAuth"

export default function withSignedIn<P extends object = object>(
  Component: ComponentType<P & { signedIn?: boolean; baseUrl?: string }>,
) {
  const WithSignedIn = (props: P) => {
    const router = useRouter()
    const { loading, signedIn } = useAuth()
    const baseUrl = router.pathname.includes("_old") ? "/_old" : ""

    useEffect(() => {
      if (!loading && !signedIn) {
        router.push(`${baseUrl}/sign-in`)
      }
    }, [loading, signedIn, router, baseUrl])

    if (loading) {
      return <div>Loading...</div>
    }

    if (!signedIn) {
      return <div>Redirecting...</div>
    }

    return <Component {...props} signedIn={signedIn} baseUrl={baseUrl} />
  }

  WithSignedIn.displayName = `withSignedIn(${
    Component.name ?? Component.displayName ?? "AnonymousComponent"
  })`

  return WithSignedIn
}
