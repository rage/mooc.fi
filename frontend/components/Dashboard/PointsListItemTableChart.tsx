import React from "react"
import styled from "styled-components"
import LinearProgress from "@material-ui/core/LinearProgress"
import { formattedGroupPoints } from "/util/formatPointsData"
import { CardSubtitle } from "components/Text/headers"

const ChartContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 90%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const ColoredProgressBar = styled(({ ...props }) => (
  <LinearProgress {...props} />
))`
  margin-top: 0.7rem;
  margin-left: 0.5rem;
  background-color: #f5f5f5;
  & .MuiLinearProgress-barColorPrimary {
    background-color: #3066c0;
  }
  & .MuiLinearProgress-barColorSecondary {
    background-color: #789fff;
  }
`

interface Props {
  title: string
  points: formattedGroupPoints
  cuttervalue: Number
  showDetailed: Boolean
}
function PointsListItemTableChart(props: Props) {
  const { title, points, cuttervalue, showDetailed } = props
  const value =
    (points.courseProgress.n_points / points.courseProgress.max_points) * 100
  let services = null
  if (points.service_progresses && points.service_progresses.length > 0) {
    services = points.service_progresses
  }

  return (
    <>
      <ChartContainer>
        <CardSubtitle
          component="h3"
          variant="body1"
          style={{ marginRight: "1rem" }}
        >
          {title}
        </CardSubtitle>
        <CardSubtitle align="right">
          {points.courseProgress.n_points} / {points.courseProgress.max_points}
        </CardSubtitle>
        <ColoredProgressBar
          variant="determinate"
          value={value}
          style={{ padding: "0.5rem", flex: 1 }}
          color={value >= cuttervalue ? "primary" : "secondary"}
        />
      </ChartContainer>
      {showDetailed ? (
        services ? (
          <>
            {services.map(s => (
              <ChartContainer
                style={{ width: "72%", marginLeft: "18%" }}
                key={Math.floor(Math.random() * 100000)}
              >
                <CardSubtitle
                  component="h4"
                  variant="body1"
                  style={{ marginRight: 5, width: "25%" }}
                >
                  {s["service"]}
                </CardSubtitle>
                <CardSubtitle
                  style={{ marginRight: 5, width: "25%" }}
                  align="right"
                >
                  {s["n_points"]} / {s["max_points"]}
                </CardSubtitle>
                <ColoredProgressBar
                  variant="determinate"
                  value={(s["n_points"] / s["max_points"]) * 100}
                  style={{ padding: "0.5rem", flex: 1 }}
                  color="secondary"
                />
              </ChartContainer>
            ))}
          </>
        ) : (
          <p>No details available</p>
        )
      ) : (
        ""
      )}
    </>
  )
}

export default PointsListItemTableChart
