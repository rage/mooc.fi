import { PropsWithChildren } from "react"

import { LinearProgress, Typography } from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"

import { CardSubtitle } from "/components/Text/headers"
import { CardCaption } from "/components/Text/paragraphs"
import notEmpty from "/util/notEmpty"

// @ts-ignore: not used
const ColoredProgressBar = styled(LinearProgress)`
  margin-top: 0.7rem;
  margin-left: 0.5rem;
  background-color: #f5f5f5;
  padding: 0.5rem;
  flex: 1;
  & .MuiLinearProgress-barColorPrimary {
    background-color: #3066c0;
  }
  & .MuiLinearProgress-barColorSecondary {
    background-color: #789fff;
  }
  & .MuiLinearProgress-dashed {
    background-image: none;
    animation: none;
  }
`

const ProgressItem = styled("div")`
  width: 100%;
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
  position: relative;
  flex-direction: column;
`
const ProgressBar = styled("div")`
  width: 100%;
  height: 1rem;
  background-color: #f5f5f5;
  position: relative;
`

interface ProgressProps {
  percentage: number
  color?: string
}

const Progress = styled("div", {
  shouldForwardProp: (prop) => prop !== "percentage" && prop !== "color",
})<ProgressProps>`
  position: absolute;
  height: 100%;
  width: ${(props) => props.percentage}%;
  background: ${(props) => props.color ?? "#3066c0"};
`

const BottomCaptionArrow = styled("div", {
  shouldForwardProp: (prop) => prop !== "percentage",
})<{ percentage: number }>`
  &:after {
    content: "";
    position: absolute;
    border: solid #ddd;
    border-width: 0 2px 2px 0;
    width: calc(${(props) => props.percentage}% - 0.5rem);
    height: 1rem;
    left: 0.5rem;
    top: -0.25rem;
    z-index: 0;
  }
`

const BottomCaptionContainer = styled("div")`
  position: relative;
  width: 100%;
  margin-top: 0.5rem;
`

const BottomCaptionArrowContainer = styled("div")`
  position: relative;
  width: 100%;
  z-index: 1;
`

const BottomCaptionChildrenContainer = styled("span")`
  position: relative;
  z-index: 1;
  padding-right: 0.5rem;
  background-color: #ffffff;
`

const BottomCaption = ({
  percentage,
  children,
}: PropsWithChildren<{ percentage: number }>) => (
  <BottomCaptionContainer>
    <BottomCaptionArrowContainer>
      <BottomCaptionArrow percentage={percentage} />
    </BottomCaptionArrowContainer>
    <BottomCaptionChildrenContainer>{children}</BottomCaptionChildrenContainer>
  </BottomCaptionContainer>
)
/* marker on hover

  &:before {
    opacity: 0;
    content: "${(props) => Math.round(props.percentage)}%";
    position: absolute;
    padding: 10px;
    background: #000;
    top: -51px;
    width: 3rem;
    left: calc(100% - 1.5rem);
    border-radius: 5px;
    color: #fff;
    transition: opacity 0.5s ease-out;
  }

  &:after {
    opacity: 0;
    content: "";
    position: absolute;
    height: 10px;
    top: -12px;
    background: rgba(255, 0, 0, 0);
    left: calc(100% - 1.5rem + 17px);
    border-left: 6px solid rgba(255, 0, 0, 0);
    border-right: 6px solid rgba(255, 0, 0, 0);
    border-top: 6px solid #000;
    transition: opacity 0.5s ease-out;
  }

  &:hover:before {
    opacity: 1;
    transition: opacity 0s ease-out;
  }

  &:hover:after {
    opacity: 1;
    transition: opacity 0s ease-out;
  }
*/

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
  requiredTitle?: string
  amount?: number | null
  required?: number | null
  requiredPercentage?: number
  total?: number | null
  success?: boolean
}

const PointsProgress = ({
  percentage,
  requiredPercentage,
  title,
  pointsTitle,
  requiredTitle,
  amount,
  total,
  required,
  success,
}: PointsProgressProps) => {
  const theme = useTheme()

  return (
    <>
      <PointsProgressTitle component="h3" variant="body1">
        {title}
      </PointsProgressTitle>
      <ChartContainer>
        <CardSubtitle align="right">
          <strong>{Math.floor(percentage)}%</strong>
        </CardSubtitle>
        <ProgressItem>
          <ProgressBar>
            {notEmpty(requiredPercentage) && (
              <Progress
                percentage={requiredPercentage}
                color={theme.palette.grey[400]}
                title={`${Math.round(requiredPercentage)}% ${
                  notEmpty(required) && notEmpty(total)
                    ? `(${required}/${total}) `
                    : ""
                } ${requiredTitle}`}
              />
            )}
            <Progress
              percentage={percentage}
              title={`${Math.round(percentage)}%`}
              color={
                success
                  ? theme.palette.success.light
                  : theme.palette.primary.dark3
              }
            />
          </ProgressBar>
          {notEmpty(requiredPercentage) && (
            <BottomCaption percentage={requiredPercentage}>
              <Typography variant="caption">Required</Typography>
            </BottomCaption>
          )}
        </ProgressItem>
        {/*<ColoredProgressBar
        variant={barVariant}
        value={percentage}
        {...notEmpty(requiredPercentage) && ({ valueBuffer: requiredPercentage })}
        color="primary"
          />*/}
      </ChartContainer>
      {notEmpty(amount) && notEmpty(total) && (
        <CardCaption component="h4" variant="caption">
          <>
            {pointsTitle ?? ""}
            {pointsTitle ? " " : ""}
            <strong>
              {amount} / {total}
            </strong>
            {notEmpty(required) && (
              <>
                {" "}
                ({required}
                {requiredTitle && " " + requiredTitle})
              </>
            )}
          </>
        </CardCaption>
      )}
    </>
  )
}

export default PointsProgress
