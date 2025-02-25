import { CardSubtitle } from "components/Text/headers"

import { LinearProgress } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { FormattedGroupPoints } from "/util/formatPointsData"
import round from "/util/round"

const ChartContainer = styled("div")`
  display: flex;
  flex-direction: row;
  width: 90%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const DetailedChartContainer = styled(ChartContainer)`
  width: 72%;
  margin-left: 18%;
`

const DetailedCardSubtitle = styled(CardSubtitle)`
  margin-right: 5px;
  width: 25%;
` as typeof CardSubtitle

const ColoredProgressBar = styled(LinearProgress)`
  margin-top: 0.7rem;
  margin-left: 0.5rem;
  padding: 0.5rem;
  flex: 1;
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
  const t = useTranslator(ProfileTranslations)

  const { title, points, cuttervalue, showDetailed } = props
  const value =
    points.courseProgress.max_points > 0
      ? (points.courseProgress.n_points / points.courseProgress.max_points) *
        100
      : 0

  return (
    <>
      <ChartContainer>
        <CardSubtitle component="h3" variant="body1" marginRight="1rem">
          {t(title as any)}
        </CardSubtitle>
        <CardSubtitle align="right">
          {round(points.courseProgress.n_points)} /{" "}
          {points.courseProgress.max_points}
        </CardSubtitle>
        <ColoredProgressBar
          variant="determinate"
          value={value}
          color={value >= cuttervalue ? "primary" : "secondary"}
        />
      </ChartContainer>
      {showDetailed &&
        (points.service_progresses?.map((s) => (
          <DetailedChartContainer key={s.service}>
            <DetailedCardSubtitle component="h4" variant="body1">
              {s["service"]}
            </DetailedCardSubtitle>
            <DetailedCardSubtitle align="right">
              {s["n_points"]} / {s["max_points"]}
            </DetailedCardSubtitle>
            <ColoredProgressBar
              variant="determinate"
              value={
                s["max_points"] > 0
                  ? (s["n_points"] / s["max_points"]) * 100
                  : 0
              }
              color="secondary"
            />
          </DetailedChartContainer>
        )) ?? <p>{t("noDetailsAvailable")}</p>)}
    </>
  )
}

export default PointsListItemTableChart
