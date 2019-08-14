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
  width: 9%;
`

const ColoredProgressBar = styled(({ ...props }) => (
  <LinearProgress {...props} />
))`
  background-color: #f5f5f5;
  & .MuiLinearProgress-barColorPrimary {
    background-color: #3066c0;
  }
`

interface ChartProps {
  pointsForAGroup: any
  cutterValue: number
}

function PointsItemTableChart(props: ChartProps) {
  const { pointsForAGroup, cutterValue } = props
  //This is due to a mistake in the seed code,
  //which caused there to be two different terms for the group field
  //will be removed
  const groupName = pointsForAGroup.group || pointsForAGroup.groups
  const value = (pointsForAGroup.n_points / pointsForAGroup.max_points) * 100

  return (
    <ChartContainer>
      <ChartTitle style={{ marginRight: "1rem" }}>{groupName}</ChartTitle>
      <ChartTitle align="right">
        {pointsForAGroup.n_points} / {pointsForAGroup.max_points}
      </ChartTitle>
      <ColoredProgressBar
        variant="determinate"
        value={value}
        style={{ padding: "0.5rem", flex: 1 }}
        color={value >= cutterValue ? "primary" : "secondary"}
      />
    </ChartContainer>
  )
}

interface TableProps {
  studentPoints: UserPointsData
  cutterValue: number
}
function PointsItemTable(props: TableProps) {
  const { studentPoints, cutterValue } = props
  let progressData: any[] = []
  if (studentPoints.progress) {
    progressData = studentPoints.progress
  }

  return (
    <>
      {progressData ? (
        progressData.map(p => (
          <PointsItemTableChart
            pointsForAGroup={p}
            cutterValue={cutterValue}
            key={Math.floor(Math.random() * 100000)}
          />
        ))
      ) : (
        <p>No points data available</p>
      )}
    </>
  )
}

export default PointsItemTable
