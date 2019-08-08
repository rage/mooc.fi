import React from "react"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progressess as UserPointsData } from "../../static/types/generated/UserCourseSettingses"

import LinearProgress from "@material-ui/core/LinearProgress"

interface ChartProps {
  pointsForAGroup: any
}
function PointsItemTableChart(props: ChartProps) {
  const { pointsForAGroup } = props

  //This is due to a mistake in the seed code,
  //which caused there to be two different terms for the group field
  //will be removed
  let groupName: string = ""
  if (pointsForAGroup.group) {
    groupName = pointsForAGroup.group
  }
  if (pointsForAGroup.groups) {
    groupName = pointsForAGroup.groups
  }

  return (
    <ListItem>
      {groupName}
      <LinearProgress variant="determinate" value={50} />
    </ListItem>
  )
}

interface TableProps {
  studentPoints: UserPointsData
}
function PointsItemTable(props: TableProps) {
  const { studentPoints } = props
  let progressData: any[] = []
  if (studentPoints.progress) {
    progressData = studentPoints.progress
  }
  return (
    <List>
      {progressData ? (
        progressData.map(p => <PointsItemTableChart pointsForAGroup={p} />)
      ) : (
        <p>No points data available</p>
      )}
    </List>
  )
}

export default PointsItemTable

/* <ProgressBar
          n={pointsForAGroup.n_points}
          max={pointsForAGroup.max_points}
        >
          {pointsForAGroup.n_points} / {pointsForAGroup.max_points}*/
