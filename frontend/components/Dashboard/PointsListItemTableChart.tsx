import { CardSubtitle } from "components/Text/headers"

import styled from "@emotion/styled"
import { LinearProgress } from "@mui/material"

import { FormattedGroupPoints } from "/util/formatPointsData"

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
  points: FormattedGroupPoints
  cuttervalue: number
  showDetailed: boolean
}
function PointsListItemTableChart(props: Props) {
  const { title, points, cuttervalue, showDetailed } = props
  const value =
    (points.courseProgress.n_points / (points.courseProgress.max_points ?? 1)) *
    100
  const services = points?.service_progresses?.length
    ? points.service_progresses
    : null

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
          {points.courseProgress.n_points.toFixed(2)} /{" "}
          {points.courseProgress.max_points}
        </CardSubtitle>
        <ColoredProgressBar
          variant="determinate"
          value={value}
          style={{ padding: "0.5rem", flex: 1 }}
          color={value >= cuttervalue ? "primary" : "secondary"}
        />
      </ChartContainer>
      {showDetailed &&
        (services?.map((s) => (
          <ChartContainer
            style={{ width: "72%", marginLeft: "18%" }}
            key={s.service}
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
              value={(s["n_points"] / (s["max_points"] ?? 1)) * 100}
              style={{ padding: "0.5rem", flex: 1 }}
              color="secondary"
            />
          </ChartContainer>
        )) ?? <p>No details available</p>)}
    </>
  )
}

export default PointsListItemTableChart
