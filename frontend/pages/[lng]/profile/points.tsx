import React from "react"
import { isSignedIn } from "/lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "/lib/redirect"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"
import { UserPoints as UserPointsData } from "/static/types/generated/UserPoints"
import { Grid } from "@material-ui/core"
//import {UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses as StudentPointsData } from "/static/types/generated/UserCourseSettingses"
import { UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses as StudentPointsData } from "/static/types/generated/UserCourseSettingses"
import Container from "/components/Container"
import Typography from "@material-ui/core/Typography"
import DashboardBreadCrumbs from "/components/Dashboard/DashboardBreadCrumbs"

export const UserPointsQuery = gql`
  query UserPoints {
    currentUser {
      ...UserPointsFragment
    }
  }
  ${PointsListItemCard.fragments.user}
`

function Points() {
  const { data, error, loading } = useQuery<UserPointsData>(UserPointsQuery)

  if (loading) {
    return <p>Loading...</p>
  }

  if (error || !data) {
    return <p>Error</p>
  }
  let dataFound = false
  let userProgressData: StudentPointsData[] = []
  if (data.currentUser && data.currentUser.user_course_progresses) {
    dataFound = true
    userProgressData = data.currentUser.user_course_progresses
  }

  return (
    <section>
      <DashboardBreadCrumbs />
      <Container>
        <Typography
          component="h1"
          variant="h1"
          align="center"
          style={{ marginTop: "2rem", marginBottom: "0.5rem" }}
        >
          Points
        </Typography>
        <Grid container spacing={3}>
          {dataFound ? (
            userProgressData.map(p => (
              <>
                <PointsListItemCard studentPoints={p} name={p.course.name} />
              </>
            ))
          ) : (
            <p>No data available</p>
          )}
        </Grid>
      </Container>
    </section>
  )
}

Points.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {}
}

export default Points
