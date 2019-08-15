import React from "react"
import LinearProgress from "@material-ui/core/LinearProgress"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"

import { pointsDataByGroup } from "/static/types/PointsByService"

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
  & .MuiLinearProgress-barColorSecondary {
    background-color: #789fff;
  }
`

interface ChartProps {
  pointsForAGroup: pointsDataByGroup
  showDetailed: boolean
}
function PointsItemTableChart(props: ChartProps) {
  const { pointsForAGroup, showDetailed } = props

  return (
    <>
      <ChartContainer>
        <ChartTitle style={{ marginRight: "1rem" }}>
          {pointsForAGroup.group}
        </ChartTitle>
        <ChartTitle align="right">
          {pointsForAGroup.summary_n_points} /{" "}
          {pointsForAGroup.summary_max_points}
        </ChartTitle>
        <ColoredProgressBar
          variant="determinate"
          value={
            (pointsForAGroup.summary_n_points /
              pointsForAGroup.summary_max_points) *
            100
          }
          style={{ padding: "0.5rem", flex: 1 }}
          color="primary"
        />
      </ChartContainer>
      {showDetailed ? (
        pointsForAGroup.services.length > 0 ? (
          //@ts-ignore
          pointsForAGroup.services.map(s => (
            <ChartContainer
              style={{ width: "72%", marginLeft: "18%" }}
              key={Math.floor(Math.random() * 100000)}
            >
              <Typography style={{ marginRight: 5, width: "25%" }}>
                {s.service}
              </Typography>
              <Typography
                style={{ marginRight: 5, width: "25%" }}
                align="right"
              >
                {s.points.n_points} / {s.points.max_points}
              </Typography>
              <ColoredProgressBar
                variant="determinate"
                value={(s.points.n_points / s.points.max_points) * 100}
                style={{ padding: "0.5rem", flex: 1 }}
                color="secondary"
              />
            </ChartContainer>
          ))
        ) : (
          <p>No Data</p>
        )
      ) : (
        ""
      )}
    </>
  )
}

interface TableProps {
  studentPoints: pointsDataByGroup[]
  showDetailedBreakdown: boolean
}
function PointsItemTable(props: TableProps) {
  const { studentPoints, showDetailedBreakdown } = props

  return (
    <>
      {studentPoints.map(p => (
        <PointsItemTableChart
          pointsForAGroup={p}
          showDetailed={showDetailedBreakdown}
          key={Math.floor(Math.random() * 100000)}
        />
      ))}
    </>
  )
}

export default PointsItemTable
