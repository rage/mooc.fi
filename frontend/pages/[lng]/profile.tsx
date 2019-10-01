import React from "react"
import { NextPageContext as NextContext } from "next"
import redirect from "/lib/redirect"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { ProfileUserOverView as UserOverViewData } from "/static/types/generated/ProfileUserOverView"
import { isSignedIn } from "/lib/authentication"
import DashboardBreadCrumbs from "/components/Dashboard/DashboardBreadCrumbs"
import Spinner from "/components/Spinner"
import ErrorMessage from "/components/ErrorMessage"
import ProfilePageHeader from "/components/Profile/ProfilePageHeader"

export const UserOverViewQuery = gql`
  query ProfileUserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      student_number
      email
      completions {
        id
        completion_language
        student_number
        created_at
        course {
          id
          slug
          name
        }
        completions_registered {
          id
          created_at
          organization {
            slug
          }
        }
      }
    }
  }
`

function Profile() {
  const { data, error, loading } = useQuery<UserOverViewData>(UserOverViewQuery)
  if (error) {
    return <ErrorMessage />
  }
  if (loading) {
    return <Spinner />
  }
  let first_name = "No first name"
  let last_name = "No last name"
  let sid = "no sid"
  let email = "no email"
  if (data && data.currentUser) {
    if (data.currentUser.first_name) {
      first_name = data.currentUser.first_name
    }
    if (data.currentUser.last_name) {
      last_name = data.currentUser.last_name
    }
    if (data.currentUser.email) {
      email = data.currentUser.email
    }
    if (data.currentUser.student_number) {
      sid = data.currentUser.student_number
    }
  }

  return (
    <>
      <DashboardBreadCrumbs />
      <ProfilePageHeader
        first_name={first_name}
        last_name={last_name}
        email={email}
        student_number={sid}
      />
    </>
  )
}

Profile.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {}
}

export default Profile
