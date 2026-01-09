import React, { ComponentType, useEffect } from "react"

import { useRouter } from "next/router"

import AdminError from "/components/Dashboard/AdminError"
import { useAuth } from "/hooks/useAuth"

function withAdmin<P extends object = object>(
  Component: ComponentType<
    P & { admin?: boolean; signedIn?: boolean; baseUrl?: string }
  >,
) {
  const WithAdmin = (props: P) => {
    const router = useRouter()
    const { loading, signedIn, admin } = useAuth()
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

    if (!admin) {
      return <AdminError />
    }

    return (
      <Component
        {...props}
        admin={admin}
        signedIn={signedIn}
        baseUrl={baseUrl}
      />
    )
  }

  WithAdmin.displayName = `withAdmin(${
    Component.displayName ?? Component.name ?? "AnonymousComponent"
  })`

  return WithAdmin
}

export default withAdmin
