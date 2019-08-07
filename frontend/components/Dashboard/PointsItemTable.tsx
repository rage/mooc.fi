import React from "react"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progressess as UserPointsData } from "../../static/types/generated/UserCourseSettingses"
import styled from "styled-components"

const ChartBase = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

interface ProgressBarProps {
  max: number
  n: number
}
const ProgressBar = styled.div<ProgressBarProps>`
  ${props => `width: ${(props.n / props.max) * 100}%;`}
  background-color: #ffc400;
  padding: 0.3rem;
`
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

  console.log(pointsForAGroup)
  return (
    <ListItem>
      {groupName}
      <ChartBase>
        <ProgressBar
          n={pointsForAGroup.n_points}
          max={pointsForAGroup.max_points}
        >
          {pointsForAGroup.n_points} / {pointsForAGroup.max_points}
        </ProgressBar>
      </ChartBase>
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
