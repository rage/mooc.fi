import React, { ChangeEvent, useEffect, useState } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"

import Container from "/components/Container"
import ErrorMessage from "/components/ErrorMessage"
import ConsentNotification from "/components/Profile/ConsentNotification"
import ProfilePageHeader from "/components/Profile/ProfilePageHeader"
import ProfileTabs from "/components/Profile/ProfileTabs"
import StudentDataDisplay from "/components/Profile/StudentDataDisplay"
import Spinner from "/components/Spinner"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedIn from "/lib/with-signed-in"
import { useQueryParameter } from "/util/useQueryParameter"

import { CurrentUserOverviewDocument } from "/graphql/generated"

// import VerifiedUsers from "/components/Profile/VerifiedUsers/VerifiedUsers"

// TODO: not visible in here, so don't query it?
/*
      verified_users {
        id
        organization {
          slug
          organization_translations {
            language
            name
          }
        }
        created_at
        personal_unique_code
        display_name
      }
*/
const tabs: Record<string, number> = {
  points: 0,
  completions: 1,
  settings: 2,
}
const tabsByNumber: Record<number, string> = Object.entries(tabs).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {},
)

function Profile() {
  const _tab = useQueryParameter("tab", false) || "points"
  const router = useRouter()

  const [tab, setTab] = useState(tabs[_tab] ?? 0)

  const handleTabChange = (_: ChangeEvent<{}>, newValue: number) => {
    // setTab(newValue)
    router.replace(
      router.pathname,
      `/profile${newValue > 0 ? `?tab=${tabsByNumber[newValue]}` : ""}`,
      { shallow: true },
    )
  }
  useEffect(() => {
    if (tabs[_tab] !== tab) {
      setTab(tabs[_tab] ?? 0)
    }
  }, [_tab])

  const { data, error, loading } = useQuery(CurrentUserOverviewDocument)

  useBreadcrumbs([
    {
      translation: "profile",
      href: "/profile",
    },
  ])

  if (error) {
    return <ErrorMessage />
  }
  if (loading) {
    return <Spinner />
  }

  const first_name = data?.currentUser?.first_name || "No first name"
  const last_name = data?.currentUser?.last_name || "No last name"
  const email = data?.currentUser?.email || "no email"
  const studentNumber = data?.currentUser?.student_number || "no student number"
  const { research_consent } = data?.currentUser ?? {}

  return (
    <>
      <ProfilePageHeader
        first_name={first_name}
        last_name={last_name}
        email={email}
        student_number={studentNumber}
      />
      <Container style={{ maxWidth: 900 }}>
        {(research_consent === null ||
          typeof research_consent === "undefined") && <ConsentNotification />}
        <ProfileTabs selected={tab} onChange={handleTabChange}>
          <StudentDataDisplay tab={tab} data={data?.currentUser || undefined} />
        </ProfileTabs>
      </Container>
    </>
  )
}

export default withSignedIn(Profile)
