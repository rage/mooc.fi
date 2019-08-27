import React from "react"
import { Grid } from "@material-ui/core"
import PointsListItemCard from "./PointsListItemCard"
import { UserCourseSettingses_UserCourseSettingses_edges as Points } from "/static/types/generated/UserCourseSettingses"

interface Props {
  pointsForUser: Points[]
}

const PointsList = (props: Props) => {
  const { pointsForUser } = props
  console.log(pointsForUser)
  return (
    <section>
      <Grid container spacing={3}>
        {pointsForUser.map(user =>
          user &&
          user.node &&
          user.node.user &&
          user.node.user.user_course_progresses ? (
            <PointsListItemCard
              studentPoints={user.node.user.user_course_progresses[0]}
              name={user.node.user.first_name + " " + user.node.user.last_name}
              email={user.node.user.email}
              SID={user.node.user.student_number}
              key={user.node.id}
            />
          ) : (
            <p>User course settings without progress data found</p>
          ),
        )}
      </Grid>
    </section>
  )
}

export default PointsList
