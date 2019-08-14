import React from "react"
import { Grid } from "@material-ui/core"
import PointsListItemCard from "./PointsListItemCard"
import { UserCourseSettingses_UserCourseSettingses_edges as Points } from "../../static/types/generated/UserCourseSettingses"

interface Props {
  pointsForUser: Points[]
  cutterValue: number
}

const PointsList = (props: Props) => {
  const { pointsForUser, cutterValue } = props

  return (
    <section>
      <Grid container spacing={3}>
        {pointsForUser.map(user => (
          <PointsListItemCard
            studentPointsPerGroup={user.node}
            cutterValue={cutterValue}
            key={user.node.id}
          />
        ))}
      </Grid>
    </section>
  )
}

export default PointsList
