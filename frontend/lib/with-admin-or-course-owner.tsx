import React, { ComponentType, useEffect } from "react"

import { useRouter } from "next/router"

import { gql, useQuery } from "@apollo/client"

import AdminError from "/components/Dashboard/AdminError"
import Spinner from "/components/Spinner"
import { useAuth } from "/hooks/useAuth"

const COURSE_OWNER_CHECK = gql`
  query CourseOwnerCheck($slug: String!) {
    course(slug: $slug) {
      id
      slug
      name
    }
    currentUser {
      id
      administrator
      course_ownerships {
        course_id
      }
    }
  }
`

function withAdminOrCourseOwner<P extends object = object>(
  Component: ComponentType<
    P & { admin?: boolean; signedIn?: boolean; baseUrl?: string }
  >,
) {
  const WithAdminOrCourseOwner = (props: P) => {
    const router = useRouter()
    const { signedIn, loading, admin } = useAuth()
    const baseUrl = router.pathname.includes("_old") ? "/_old" : ""
    const slug = (router.query.slug as string) ?? ""

    const {
      data,
      loading: ownershipLoading,
      error,
    } = useQuery(COURSE_OWNER_CHECK, {
      variables: { slug },
      skip: !signedIn || !slug,
      fetchPolicy: "network-only",
    })

    const isOwner = Boolean(
      data?.course?.id &&
        data?.currentUser?.course_ownerships?.some(
          (o: { course_id: string | null }) => o.course_id === data.course?.id,
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

    if (error) {
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
