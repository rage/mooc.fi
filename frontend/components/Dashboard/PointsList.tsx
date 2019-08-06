import React from "react"
import { Grid } from "@material-ui/core"
import PointsListHeader from "./PointsListHeader"
import PointsListItemCard from "./PointsListItemCard"
import { UserCourseSettingses as Points } from "../../static/types/generated/UserCourseSettingses"

interface Props {
  studentProgresses: Points
}

const PointsList = (props: Props) => {
  const { studentProgresses } = props
  return (
    <section>
      <Grid container spacing={3}>
        <PointsListHeader />
        <PointsListItemCard />
      </Grid>
    </section>
  )
}

export default PointsList
