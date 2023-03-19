import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { orderBy } from "lodash"

import { LinearProgress, Typography, useMediaQuery } from "@mui/material"
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

const ProgressLegendContainer = styled("div")`
  position: relative;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`

const ArrowComponent = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "percentage" &&
    prop !== "order" &&
    prop !== "reversed" &&
    prop !== "maxPercentage",
})<{
  order: number
  percentage: number
  maxPercentage: number
  reversed: boolean
}>`
  position: absolute;
  width: ${(props) =>
    props.reversed
      ? `calc(${props.maxPercentage - props.percentage}% - 0.5rem)`
      : `${props.percentage}%`};
  margin-left: 0.5rem;
  border: solid #ddd;
  border-width: ${(props) => (props.reversed ? "0 0 2px 2px" : "0 2px 2px 0")};
  height: ${(props) => 1 + props.order}rem;
  z-index: 0;
  top: -0.25rem;
  left: ${(props) =>
    props.reversed ? `calc(${props.percentage}% - 0.5rem)` : "-0.5rem"};
`

const Caption = styled("span", {
  shouldForwardProp: (prop) => prop !== "order" && prop !== "reversed",
})<{ order: number; reversed: boolean }>`
  position: absolute;
  z-index: ${(props) => 1 + props.order};
  ${(props) => (props.reversed ? "padding-left" : "padding-right")}: 0.5rem;
  background-color: #ffffff;
  top: ${(props) => 0.125 + props.order * 1.125}rem;
  ${(props) => (props.reversed ? "right: 0" : "left: 0")};
`
type ArrowProps = {
  percentage: number
  maxPercentage?: number
  order: number
  caption?: string
}

const ProgressLegendComponent = ({
  percentage,
  maxPercentage = 100,
  order,
  caption,
}: PropsWithChildren<ArrowProps>) => {
  const captionRef = useRef<HTMLSpanElement | null>(null)
  const arrowRef = useRef<HTMLDivElement | null>(null)
  const reversed = useRef(false)

  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    setRendered(true)
  })

  const handleResize = useCallback(() => {
    if (!captionRef.current || !arrowRef.current) return false

    const captionWidth = captionRef.current.getBoundingClientRect().width
    const rem = parseFloat(getComputedStyle(arrowRef.current).fontSize)
    const arrowWidth =
      (arrowRef.current.getBoundingClientRect().width ?? 0) - rem * 0.5

    reversed.current = captionWidth > arrowWidth
  }, [rendered, captionRef.current, arrowRef.current])

  useEffect(() => {
    window.addEventListener("resize", handleResize)

    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  return (
    <ArrowComponent
      ref={(el) => (arrowRef.current = el)}
      key={`arrow-${percentage}-${reversed.current}`}
      percentage={percentage}
      maxPercentage={maxPercentage}
      order={order}
      reversed={reversed.current}
    >
      {caption && (
        <Caption
          key={`caption-${percentage}-${reversed.current}`}
          order={order}
          ref={(el) => (captionRef.current = el)}
          reversed={reversed.current}
        >
          <Typography variant="caption">{caption}</Typography>
        </Caption>
      )}
    </ArrowComponent>
  )
}

type PercentageData = {
  caption?: string
  percentage: number
}

const ProgressLegend = ({
  data,
}: PropsWithChildren<{ data: Array<PercentageData> }>) => {
  const maxPercentage = Math.max(...data.map((d) => d.percentage))
  const isNarrow = useMediaQuery("(max-width: 800px)", { noSsr: true }) // need to retrigger another render after resize

  return (
    <ProgressLegendContainer>
      {orderBy(data, "percentage").map((p, index) => (
        <ProgressLegendComponent
          key={`legend-${p.percentage}-${p.caption}-${isNarrow}`}
          order={index}
          percentage={p.percentage}
          maxPercentage={maxPercentage}
          caption={p.caption}
        />
      ))}
    </ProgressLegendContainer>
  )
}
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

  const hasRequiredPercentage = notEmpty(requiredPercentage)

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
            {hasRequiredPercentage && (
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
          {hasRequiredPercentage && (
            <ProgressLegend
              data={[
                {
                  caption: "Progress",
                  percentage,
                },
                {
                  caption: "Required",
                  percentage: requiredPercentage,
                },
              ]}
            />
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
