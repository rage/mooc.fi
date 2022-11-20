import { css } from "@emotion/react"
import styled from "@emotion/styled"
import Typography, { TypographyProps } from "@mui/material/Typography"

export const CardWrapper = styled.li`
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-left: 1px solid rgba(88, 89, 91, 0.25);
  min-height: 300px;
  display: flex;
  flex-direction: column;
`

export const CardHeader = styled.header`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  z-index: -2;
`

export const CardHeaderImage = styled.img`
  opacity: 0.4;
  position: absolute;
  left: 70%;
  top: 0.5rem;
  width: 25%;
  height: auto;
  clip: rect(0, auto, calc(52px - 1rem), auto);
  z-index: 0;
`

CardHeaderImage.defaultProps = {
  "aria-hidden": true,
}

export const CardBody = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  height: 100%;
`

export const CardDescription = styled.p`
  height: 100%;
`

export const CardActionArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const CardTitle = styled((props: TypographyProps) => (
  <Typography variant="h2" {...props} />
))`
  z-index: 1;
`
const CommonHeaderBackground = css`
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export const CardHeaderBackground = styled.span<{
  image: string
  hue?: number
  brightness?: number
}>`
  ${CommonHeaderBackground};
  /*filter: hue-rotate(${(props) => props.hue ?? 0}deg)
    brightness(${(props) => props.brightness ?? 1});*/
  background-size: cover;
  background-image: linear-gradient(to left, rgba(255, 0, 0, 0), #065853 55%),
    url(${(props) => `../../../static/images/${props.image}`});
`

CardHeaderBackground.defaultProps = {
  "aria-hidden": true,
}

export const CardHeaderBackgroundSkeleton = styled.span`
  ${CommonHeaderBackground};
  background-color: #aaa;
`
