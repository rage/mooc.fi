import { useQuery } from "@apollo/client"
import Spinner from "/components/Spinner"
import ErrorMessage from "/components/ErrorMessage"
import ProfilePageHeader from "/components/Profile/ProfilePageHeader"
import StudentDataDisplay from "/components/Profile/StudentDataDisplay"
import Container from "/components/Container"
import withSignedIn from "/lib/with-signed-in"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import React, { ChangeEvent, useState } from "react"
import styled from "@emotion/styled"
import ProfileTabs from "/components/Profile/ProfileTabs"
import { UserOverViewQuery } from "/graphql/queries/user"
import { CurrentUserUserOverView } from "/static/types/generated/CurrentUserUserOverView"

const ConsentNotification = styled.div`
  display: flex;
  padding: 6px 16px;
  line-height: 1.43;
  border-radius: 4px;
  letter-spacing: 0.01071em;
  background-color: rgb(255, 244, 229);
`

function Profile() {
  const { data, error, loading } = useQuery<CurrentUserUserOverView>(
    UserOverViewQuery,
  )

  const [tab, setTab] = useState(0)
  const handleTabChange = (_: ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }

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
