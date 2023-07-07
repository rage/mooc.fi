import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { sort } from "remeda"

import { Skeleton, Typography, useMediaQuery } from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"

import { CardSubtitle } from "/components/Text/headers"
import { CardCaption } from "/components/Text/paragraphs"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import { isDefinedAndNotEmpty } from "/util/guards"
import round from "/util/round"

const ProgressItem = styled("div")`
  width: 100%;
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
  padding-top: 2rem;
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

type ProgressLegendProps = {
  percentage: number
  maxPercentage?: number
  order: number
  caption?: string
  valueCaption?: string
  color?: string
}

const Marker = styled("div", {
  shouldForwardProp: (prop) => prop !== "percentage" && prop !== "color",
})<ProgressProps>`
  position: absolute;
  width: 0.125rem;
  height: 2.5rem;
  top: -2.5rem;
  border-radius: 0.125rem;
  background-color: ${(props) => props.color ?? "#3066c0"};
  left: calc(${(props) => props.percentage}% - 0.0625rem);
`

const Caption = styled("div", {
  shouldForwardProp: (prop) => prop !== "percentage" && prop !== "reversed",
})<{ percentage: number; reversed?: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
  z-index: 1;
  top: -3.5rem;
  ${(props) =>
    props.reversed
      ? `right: calc(${100 - props.percentage}% + 0.5rem)`
      : `left: calc(${props.percentage}%)`};
  white-space: nowrap;
`

const ProgressLegendMarker = ({
  percentage,
  caption,
  valueCaption,
  color,
}: ProgressLegendProps) => {
  const markerRef = useRef<HTMLDivElement | null>(null)
  const captionRef = useRef<HTMLDivElement | null>(null)

  const isOverflowingRight = useRef(false)

  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    setRendered(true)
  }, [])

  const handleResize = useCallback(() => {
    if (!captionRef.current || !markerRef.current) return false

    const rem = parseFloat(getComputedStyle(captionRef.current).fontSize)

    const captionWidth = captionRef.current.getBoundingClientRect().width
    const markerRightX = markerRef.current.getBoundingClientRect().right ?? 0
    const containerRightX =
      captionRef.current.parentElement?.getBoundingClientRect().right ?? 0

    isOverflowingRight.current =
      markerRightX + 0.5 * rem + captionWidth > containerRightX
  }, [rendered, markerRef.current, captionRef.current])

  useLayoutEffect(() => {
    handleResize()
  }, [])

  useEffect(() => {
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <Marker
        key={`marker-${percentage}-${caption}-${isOverflowingRight.current}`}
        percentage={percentage}
        color={color}
        ref={(el: HTMLDivElement | null) => (markerRef.current = el)}
      />
      {(caption || valueCaption) && (
        <Caption
          key={`caption-${percentage}-${caption}-${isOverflowingRight.current}`}
          percentage={percentage}
          reversed={isOverflowingRight.current}
          ref={(el: HTMLDivElement | null) => (captionRef.current = el)}
        >
          {caption && <Typography variant="caption">{caption}</Typography>}
          {valueCaption && (
            <Typography variant="caption">{valueCaption}</Typography>
          )}
        </Caption>
      )}
    </>
  )
}
type ProgressLegendData = {
  caption?: string
  valueCaption?: string
  percentage: number
  color?: string
}

const ProgressLegendMarkerContainer = styled("div")`
  width: 100%;
  position: relative;
`

const ProgressLegend = ({
  data,
}: PropsWithChildren<{ data: Array<ProgressLegendData> }>) => {
  const isNarrow = useMediaQuery("(max-width: 800px)", { noSsr: true }) // need to retrigger another render after resize

  return (
    <ProgressLegendMarkerContainer>
      {sort(data, (e) => e.percentage).map((p, index) => (
        <ProgressLegendMarker
          key={`legend-${p.percentage}-${p.caption}-${isNarrow}`}
          order={index}
          {...p}
        />
      ))}
    </ProgressLegendMarkerContainer>
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
  margin-top: 0;
` as typeof CardSubtitle

const ProgressPercentage = styled(CardSubtitle)`
  align: right;
  padding-top: 1.25rem;
  font-weight: 700;
`

const Column = styled("div")`
  display: flex;
  flex-direction: column;
`

export type PointsProgressData = {
  percentage: number
  amount?: number | null
  total?: number | null
  required?: number | null
  requiredPercentage?: number
}

interface PointsProgressProps extends PointsProgressData {
  title: string
  pointsTitle?: string
  requiredTitle?: string
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
  const t = useTranslator(CommonTranslations)
  const theme = useTheme()

  const hasRequiredPercentage = isDefinedAndNotEmpty(requiredPercentage)

  return (
    <Column>
      <PointsProgressTitle component="h3" variant="body1">
        {title}
      </PointsProgressTitle>
      <ChartContainer>
        <ProgressPercentage>{Math.floor(percentage)}%</ProgressPercentage>
        <ProgressItem>
          <ProgressBar>
            {hasRequiredPercentage && (
              <Progress
                key={`${title}-required-${requiredPercentage}`}
                percentage={requiredPercentage}
                color={theme.palette.grey[400]}
                title={`${Math.round(requiredPercentage)}% ${
                  isDefinedAndNotEmpty(required) && isDefinedAndNotEmpty(total)
                    ? `(${required}/${total}) `
                    : ""
                } ${requiredTitle}`}
              />
            )}
            <Progress
              key={`${title}-progress-${percentage}`}
              percentage={percentage}
              title={`${Math.round(percentage)}%`}
              color={
                success
                  ? theme.palette.success.light
                  : theme.palette.primary.dark3
              }
            />
          </ProgressBar>
          {hasRequiredPercentage && !success && (
            <ProgressLegend
              data={[
                {
                  caption: t("required"),
                  valueCaption:
                    `${Math.round(requiredPercentage)}%` +
                    (isDefinedAndNotEmpty(required) &&
                    isDefinedAndNotEmpty(total)
                      ? ` (${round(required)}/${total})`
                      : ""),
                  percentage: requiredPercentage,
                  color: theme.palette.grey[400],
                },
              ]}
            />
          )}
        </ProgressItem>
      </ChartContainer>
      {isDefinedAndNotEmpty(amount) && isDefinedAndNotEmpty(total) && (
        <CardCaption component="h4" variant="caption">
          <>
            {pointsTitle ?? ""}
            {pointsTitle ? " " : ""}
            <strong>
              {round(amount)} / {round(total)}
            </strong>
            {isDefinedAndNotEmpty(required) && (
              <>
                {" "}
                ({required}
                {requiredTitle && " " + requiredTitle})
              </>
            )}
          </>
        </CardCaption>
      )}
    </Column>
  )
}

export const PointsProgressSkeleton = () => (
  <>
    <PointsProgressTitle component="h3" variant="body1">
      <Skeleton variant="text" width="100px" />
    </PointsProgressTitle>
    <ChartContainer>
      <Skeleton width="85%" height="4rem" />
    </ChartContainer>
  </>
)

export default PointsProgress
