import { LinearProgress } from "@mui/material"
import { styled } from "@mui/material/styles"

import { CardSubtitle } from "/components/Text/headers"
import { CardCaption } from "/components/Text/paragraphs"
import notEmpty from "/util/notEmpty"

const ColoredProgressBar = styled(LinearProgress)`
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

const ChartContainer = styled("div")`
  display: flex;
  flex-direction: row;
  width: 90%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const PointsProgressTitle = styled(CardSubtitle)`
  margin-right: 1rem;
` as typeof CardSubtitle

interface PointsProgressProps {
  percentage: number
  title: string
  pointsTitle?: string
  amount?: number | null
  total?: number | null
}

const PointsProgress = ({
  percentage,
  title,
  pointsTitle,
  amount,
  total,
}: PointsProgressProps) => (
  <>
    <PointsProgressTitle component="h3" variant="body1">
      {title}
    </PointsProgressTitle>
    <ChartContainer>
      <CardSubtitle align="right">
        <strong>{Math.floor(percentage)}%</strong>
      </CardSubtitle>
      <ColoredProgressBar
        variant="determinate"
        value={percentage}
        style={{ padding: "0.5rem", flex: 1 }}
        color="primary"
      />
    </ChartContainer>
    {notEmpty(amount) && notEmpty(total) && (
      <CardCaption component="h4" variant="caption">
        {pointsTitle ?? ""}
        {pointsTitle ? " " : ""}
        <strong>
          {amount} / {total}
        </strong>
      </CardCaption>
    )}
  </>
)

export default PointsProgress
