import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react"

import Router, { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { styled } from "@mui/material/styles"

import Container from "/components/Container"
import ErrorMessage from "/components/ErrorMessage"
import ConsentNotification from "/components/Profile/ConsentNotification"
import ProfilePageHeader from "/components/Profile/ProfilePageHeader"
import ProfileTabs from "/components/Profile/ProfileTabs"
import StudentDataDisplay from "/components/Profile/StudentDataDisplay"
import Spinner from "/components/Spinner"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import withSignedIn from "/lib/with-signed-in"

import { CurrentUserOverviewDocument } from "/graphql/generated"

// import VerifiedUsers from "/components/Profile/VerifiedUsers/VerifiedUsers"
const ProfileContainer = styled(Container)(
  ({ theme }) => `
  max-width: 900px;
  width: 85%;
  margin: auto;

  ${theme.breakpoints.down("sm")} {
    width: 90%;
    margin: auto;
  }
`,
)

const tabs: Record<string, number> = {
  points: 0,
  completions: 1,
  settings: 2,
}

const tabsByNumber: Record<number, string> = {}

for (const tab of Object.keys(tabs)) {
  tabsByNumber[tabs[tab]] = tab
}

function Profile() {
  const { currentUser } = useLoginStateContext()
  const _tab = useQueryParameter("tab", { enforce: false }) ?? "points"
  const { pathname } = useRouter()

  const [tab, setTab] = useState(tabs[_tab] ?? 0)
  const [, startTransition] = useTransition()

  const handleTabChange = useCallback(
    (_: SyntheticEvent<Element, Event>, newValue: number) => {
      startTransition(() => {
        setTab(newValue)
        Router.replace(
          {
            href: pathname,
            query: newValue > 0 ? { tab: tabsByNumber[newValue] } : undefined,
          },
          undefined,
          { shallow: true },
        )
      })
    },
    [pathname],
  )

  useEffect(() => {
    if (tabs[_tab] !== tab) {
      setTab(tabs[_tab] ?? 0)
    }
  }, [_tab])

  const { data, error, loading } = useQuery(CurrentUserOverviewDocument, {
    ssr: false,
  })

  useBreadcrumbs([
    {
      translation: "profile",
      href: "/profile",
    },
  ])

  if (error) {
    return <ErrorMessage />
  }

  const first_name = currentUser?.first_name ?? "No first name"
  const last_name = currentUser?.last_name ?? "No last name"
  const email = currentUser?.email ?? "no email"
  const studentNumber = currentUser?.student_number ?? "no student number"
  const { research_consent } = data?.currentUser ?? {}

  return (
    <>
      <ProfilePageHeader
        first_name={first_name}
        last_name={last_name}
        email={email}
        student_number={studentNumber}
      />
      <ProfileContainer>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {(research_consent === null ||
              typeof research_consent === "undefined") && (
              <ConsentNotification />
            )}
            <ProfileTabs selected={tab} onChange={handleTabChange}>
              <StudentDataDisplay
                tab={tab}
                data={data?.currentUser || undefined}
              />
            </ProfileTabs>
          </>
        )}
      </ProfileContainer>
    </>
  )
}

export default withSignedIn(Profile)
