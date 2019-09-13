import React from "react"
import { Grid } from "@material-ui/core"
import PointsListItemCard from "./PointsListItemCard"
import { UserCourseSettingses_UserCourseSettingses_edges as Points } from "/static/types/generated/UserCourseSettingses"

interface Props {
  pointsForUser: Points[]
  cutterValue: number
}

const PointsList = (props: Props) => {
  const { pointsForUser, cutterValue } = props

  return (
    <section>
      <Grid container spacing={3}>
        {pointsForUser.map(p =>
          p &&
          p.node &&
          p.node.user &&
          p.node.user.user_course_progresses &&
          p.node.user.user_course_progresses[0] ? (
            <PointsListItemCard
              studentPoints={p.node.user.user_course_progresses[0]}
              name={p.node.user.first_name + " " + p.node.user.last_name}
              email={p.node.user.email}
              SID={p.node.user.student_number}
              key={p.node.id}
              cutterValue={cutterValue}
            />
          ) : (
            <></>
          ),
        )}
      </Grid>
    </section>
  )
}

export default PointsList
