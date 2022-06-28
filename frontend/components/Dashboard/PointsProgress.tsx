import styled from "@emotion/styled"
import { LinearProgress } from "@mui/material"

import { CardSubtitle } from "/components/Text/headers"

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

const ChartContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 90%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const PointsProgress = ({ total, title }: { total: number; title: string }) => (
  <>
    <CardSubtitle
      component="h3"
      variant="body1"
      style={{ marginRight: "1rem" }}
    >
      {title}
    </CardSubtitle>
    <ChartContainer>
      <CardSubtitle align="right">{total.toFixed(0)}%</CardSubtitle>
      <ColoredProgressBar
        variant="determinate"
        value={total}
        style={{ padding: "0.5rem", flex: 1 }}
        color="primary"
      />
    </ChartContainer>
  </>
)

export default PointsProgress
