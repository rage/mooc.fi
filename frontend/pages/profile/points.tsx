import React from "react"
import { isSignedIn } from "../../lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "../../lib/redirect"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
//import PointsListItemCard from "../../components/Dashboard/PointsListItemCard"
import {
  UserPoints,
  UserPoints_currentUser_user_course_progresses as UserPointsData,
} from "../../static/types/generated/UserPoints"

export const UserPointsQuery = gql`
  query UserPoints {
    currentUser {
      id
      user_course_progresses {
        id
        user {
          id
          first_name
          last_name
          email
          student_number
        }
        course {
          id
          name
        }
        progress
        user_course_service_progresses {
          course {
            id
            name
          }
          service {
            id
            name
          }
          progress
        }
      }
    }
  }
`

function Points() {
  //@ts-ignore
  const { data, error, loading } = useQuery<UserPoints>(UserPointsQuery)

  if (loading) {
    return <p>Loading...</p>
  }

  if (error || !data) {
    return <p>Error</p>
  }
  let coursesUserHasPointsFor: UserPointsData[] =
    data!.currentUser!.user_course_progresses! || []
  if (coursesUserHasPointsFor.length === 0) {
    return <p>No points for courses yet</p>
  }

  return (
    //@ts-ignore
    <>
      {coursesUserHasPointsFor.map(course => (
        <>
          <p>{course.course.name}</p>
        </>
      ))}
    </>
  )
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
