import React from "react"
import { UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progressess as UserPointsData } from "../../static/types/generated/UserCourseSettingses"
import LinearProgress from "@material-ui/core/LinearProgress"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"

const ChartContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 90%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const ChartTitle = styled(Typography)`
  margin-right: 5px;
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

  return (
    <ChartContainer>
      <ChartTitle>{groupName}</ChartTitle>

      <LinearProgress
        variant="determinate"
        value={(pointsForAGroup.n_points / pointsForAGroup.max_points) * 100}
        style={{ padding: "0.5rem", flex: 1 }}
        color="secondary"
      />
    </ChartContainer>
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
    <>
      {progressData ? (
        progressData.map(p => <PointsItemTableChart pointsForAGroup={p} />)
      ) : (
        <p>No points data available</p>
      )}
    </>
  )
}

export default PointsItemTable
