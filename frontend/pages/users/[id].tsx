import * as React from "react"
import Container from "../../components/Container"
import { NextPageContext } from "next"
import { isAdmin, isSignedIn } from "../../lib/authentication"
import redirect from "../../lib/redirect"
import AdminError from "../../components/Dashboard/AdminError"
import gql from "graphql-tag"

interface UserPageProps {
  namespacesRequired: string[]
  t: Function
  i18n: any
  admin: boolean
}

const UserPage = (props: UserPageProps) => {
  if (!props.admin) {
    return <AdminError />
  }

  return <Container>User Page</Container>
}

UserPage.getInitialProps = function(context: NextPageContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}
export default UserPage

const GET_DATA = gql`
  query UserCourseSettingses($upstream_id: number) {
    UserCourseSettingses(user_upstream_id: $upstream_id, first: 50) {
      edges {
        node {
          id
          course {
            name
          }
          language
          country
          research
          marketing
          course_variant
          other
        }
      }
    }
  }
`
