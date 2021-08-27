import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client"
import { ProfileUserOverView as UserOverViewData } from "/static/types/generated/ProfileUserOverView"
import Spinner from "/components/Spinner"
import ErrorMessage from "/components/ErrorMessage"
import ProfilePageHeader from "/components/Profile/ProfilePageHeader"
import StudentDataDisplay from "/components/Profile/StudentDataDisplay"
import withSignedIn from "/lib/with-signed-in"
import { CompletionsRegisteredFragment } from "/graphql/fragments/completionsRegistered"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import React, { ChangeEvent, useState } from "react"
import ProfileTabs from "/components/Profile/ProfileTabs"
import ConsentNotification from "/components/Profile/ConsentNotification"
import { useRouter } from "next/router"
import { useLanguageContext } from "/contexts/LanguageContext"
import { useQueryParameter } from "/util/useQueryParameter"
import { useEffect } from "react"
import Container from "/components/Container"
// import VerifiedUsers from "/components/Profile/VerifiedUsers/VerifiedUsers"

export const UserOverViewQuery = gql`
  query ProfileUserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      student_number
      email
      administrator
      verified_users {
        id
        home_organization
        person_affiliation
        person_affiliation_updated_at
        updated_at
        created_at
        personal_unique_code
        display_name
        mail
        organizational_unit
      }
      completions {
        id
        completion_language
        student_number
        created_at
        tier
        eligible_for_ects
        completion_date
        course {
          id
          slug
          name
          photo {
            uncompressed
          }
          has_certificate
        }
        ...CompletionsRegisteredFragment
      }
      research_consent
    }
  }
  ${CompletionsRegisteredFragment}
`

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
  const { language } = useLanguageContext()

  const [tab, setTab] = useState(tabs[_tab] ?? 0)

  const handleTabChange = (_: ChangeEvent<{}>, newValue: number) => {
    // setTab(newValue)
    router.replace(
      router.pathname,
      `/${language}/profile${
        newValue > 0 ? `?tab=${tabsByNumber[newValue]}` : ""
      }`,
      { shallow: true },
    )
  }
  useEffect(() => {
    if (tabs[_tab] !== tab) {
      setTab(tabs[_tab] ?? 0)
    }
  }, [_tab])

  const { data, error, loading } = useQuery<UserOverViewData>(UserOverViewQuery)

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
