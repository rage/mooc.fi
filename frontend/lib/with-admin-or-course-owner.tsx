import { ComponentType, useEffect } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client/react"

import AdminError from "/components/Dashboard/AdminError"
import Spinner from "/components/Spinner"
import { useAuth } from "/hooks/useAuth"

import { CourseOwnerCheckDocument } from "/graphql/generated"

function withAdminOrCourseOwner<P extends object = object>(
  Component: ComponentType<
    P & { admin?: boolean; signedIn?: boolean; baseUrl?: string }
  >,
) {
  const WithAdminOrCourseOwner = (props: P) => {
    const router = useRouter()
    const { signedIn, loading, admin } = useAuth()
    const baseUrl = router.pathname.includes("_old") ? "/_old" : ""
    const rawSlug = router.query.slug
    const slug = Array.isArray(rawSlug) ? (rawSlug[0] ?? "") : (rawSlug ?? "")

    const {
      data,
      loading: ownershipLoading,
      error,
    } = useQuery(CourseOwnerCheckDocument, {
      variables: { slug },
      skip: !signedIn || !slug,
      fetchPolicy: "network-only",
    })

    const isOwner = Boolean(
      data?.course?.id &&
      data?.currentUser?.course_ownerships?.some(
        (o) => o.course_id === data.course?.id,
      ),
    )

    useEffect(() => {
      if (!loading && !signedIn) {
        router.push(`${baseUrl}/sign-in`)
      }
    }, [loading, signedIn, router, baseUrl])

    if (loading || ownershipLoading || !slug) {
      return <Spinner />
    }

    if (!signedIn) {
      return <div>Redirecting...</div>
    }

    // Partial GraphQL errors fall through to the admin/owner check below.
    if (error && !data) {
      return <AdminError />
    }

    if (!admin && !isOwner) {
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

  WithAdminOrCourseOwner.displayName = `withAdminOrCourseOwner(${
    Component.displayName ?? Component.name ?? "AnonymousComponent"
  })`

  return WithAdminOrCourseOwner
}

export default withAdminOrCourseOwner
