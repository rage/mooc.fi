import * as React from "react"
import Container from "../../components/Container"
import { NextPageContext } from "next"
import { isAdmin, isSignedIn } from "../../lib/authentication"
import redirect from "../../lib/redirect"
import AdminError from "../../components/Dashboard/AdminError"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import { UserCourseSettingsesForUserPage } from "../../static/types/generated/UserCourseSettingsesForUserPage"
import { Grid } from "@material-ui/core"
import { CircularProgress } from "@material-ui/core"
import { SingletonRouter, withRouter } from "next/router"
import NextI18Next from "../../i18n"

interface UserPageProps {
  namespacesRequired: string[]
  t: Function
  router: SingletonRouter
  i18n: any
  admin: boolean
}

const UserPage = (props: UserPageProps) => {
  const { admin } = props
  const { loading, error, data } = useQuery<UserCourseSettingsesForUserPage>(
    GET_DATA,
    { variables: { $upstream_id: Number(props.router.query.id) } },
  )

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (!admin) {
    return <AdminError />
  }

  if (loading || !data) {
    return (
      <Container style={{ display: "flex", height: "600px" }}>
        <Grid item container justify="center" alignItems="center">
          <CircularProgress color="primary" size={60} />
        </Grid>
      </Container>
    )
  }

  return (
    <Container>
      <pre>{JSON.stringify(data.UserCourseSettingses.edges, undefined, 2)}</pre>
    </Container>
  )
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
export default withRouter(NextI18Next.withTranslation("common")(UserPage))

const GET_DATA = gql`
  query UserCourseSettingsesForUserPage($upstream_id: Int) {
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
