import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client"
import { ProfileUserOverView as UserOverViewData } from "/static/types/generated/ProfileUserOverView"
import Spinner from "/components/Spinner"
import ErrorMessage from "/components/ErrorMessage"
import ProfilePageHeader from "/components/Profile/ProfilePageHeader"
import StudentDataDisplay from "/components/Profile/StudentDataDisplay"
import Container from "/components/Container"
import withSignedIn from "/lib/with-signed-in"
import { CompletionsRegisteredFragment } from "/graphql/fragments/completionsRegistered"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import React, { ChangeEvent, useState } from "react"
import styled from "@emotion/styled"
import Warning from "@material-ui/icons/Warning"
import ProfileTabs from "/components/Profile/ProfileTabs"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"
import notEmpty from "/util/notEmpty"

export const UserOverViewQuery = gql`
  query ProfileUserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      student_number
      email
      verified_users {
        id
        home_organization
        person_affiliation
        person_affiliation_updated_at
        updated_at
        created_at
        personal_unique_code
        display_name
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

const ConsentNotification = styled.div`
  display: flex;
  padding: 6px 16px;
  line-height: 1.43;
  border-radius: 4px;
  letter-spacing: 0.01071em;
  background-color: rgb(255, 244, 229);
`

function Profile() {
  const t = useTranslator(ProfileTranslations)

  const { data, error, loading } = useQuery<UserOverViewData>(UserOverViewQuery)

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
        {!notEmpty(research_consent) && (
          <ConsentNotification>
            <Warning />
            {t("researchNotification")}
          </ConsentNotification>
        )}
        {/*<VerifiedUsers
          data={data?.currentUser?.verified_users}
        />*/}
        <ProfileTabs selected={tab} onChange={handleTabChange}>
          <StudentDataDisplay tab={tab} data={data?.currentUser || undefined} />
        </ProfileTabs>
      </Container>
    </>
  )
}

export default withSignedIn(Profile)
