import React from "react"
import { Grid } from "@material-ui/core"
//@ts-ignore
import PointsListItemCard from "./PointsListItemCard"
import { UserCourseSettingses_UserCourseSettingses_edges as Points } from "/static/types/generated/UserCourseSettingses"

interface Props {
  pointsForUser: Points[]
  cutterValue: number
}

const PointsList = (props: Props) => {
  const { pointsForUser, cutterValue } = props
  console.log(pointsForUser)
  console.log(cutterValue)
  return (
    <section>
      <Grid container spacing={3}>
        {pointsForUser.map(p =>
          p && p.node && p.node.user && p.node.user.progress ? (
            <PointsListItemCard pointsAll={p.node.user.progress} />
          ) : (
            <></>
          ),
        )}
      </Grid>
    </section>
  )
}

export default PointsList
