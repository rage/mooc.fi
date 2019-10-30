import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import LinearProgress from "@material-ui/core/LinearProgress"

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

interface Props {
  title: string
  points: any[]
  cuttervalue: Number
  showDetailed: Boolean
}
function PointsListItemTableChart(props: Props) {
  const { title, points, cuttervalue, showDetailed } = props
  const value = (points[0]["n_points"] / points[0]["max_points"]) * 100
  let services = null
  if (points.length > 0) {
    services = points.slice(1)
  }
  console.log("showDetailed", showDetailed)
  console.log("points", points)
  console.log("services", services)
  return (
    <>
      <ChartContainer>
        <ChartTitle style={{ marginRight: "1rem" }}>{title}</ChartTitle>
        <ChartTitle align="right">
          {points[0]["n_points"]} / {points[0]["max_points"]}
        </ChartTitle>
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
                <Typography style={{ marginRight: 5, width: "25%" }}>
                  {s["service"]}
                </Typography>
                <Typography
                  style={{ marginRight: 5, width: "25%" }}
                  align="right"
                >
                  {s["n_points"]} / {s["max_points"]}
                </Typography>
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
