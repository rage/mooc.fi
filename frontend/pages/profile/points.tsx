import React from "react"
import { isSignedIn } from "../../lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "../../lib/redirect"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"

export const UserPointsQuery = gql`
  query UserPoints {
    currentUser {
      id
      user_course_progresses {
        course {
          id
          name
        }
        progress
      }
    }
  }
`

function Points() {
  const { data, error, loading, fetchMore } = useQuery(UserPointsQuery)
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error</p>
  }
  console.log(data)
  console.log(fetchMore)
  return <p>User data comes here</p>
}

Points.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    namespacesRequired: ["profile"],
  }
}

export default Points
