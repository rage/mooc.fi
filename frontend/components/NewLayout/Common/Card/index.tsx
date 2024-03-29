import Image from "next/image"

import { Typography, TypographyProps } from "@mui/material"
import { css, styled } from "@mui/material/styles"

export const CardWrapper = styled("div")`
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-left: 1px solid rgba(88, 89, 91, 0.25);
  min-height: 300px;
  display: flex;
  flex-direction: column;
`

export const CardHeader = styled("div")`
  height: 120px;
  min-height: 120px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 1rem;
  background-color: #fefefe;
  z-index: -2;
`

export const CardHeaderImage = styled(Image)`
  opacity: 0.4;
  position: absolute;
  left: 70%;
  top: 0.5rem;
  width: 25%;
  height: auto;
  clip: rect(0, auto, calc(52px - 1rem), auto);
  z-index: 0;
`

//CardHeaderImage.defaultProps = {
//  "aria-hidden": true,
//}

export const CardBody = styled("div")`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  height: 100%;
`

export const CardDescription = styled("p")`
  height: 100%;
`

export const CardActions = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const CardTitle = styled((props: TypographyProps) => (
  <Typography variant="h2" {...props} />
))`
  z-index: 1;
` as typeof Typography

const CommonHeaderBackground = css`
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

interface CardHeaderBackgroundProps {
  image?: string
  color?: string
  hue?: number
  brightness?: number
}

export const CardHeaderBackground = styled("span", {
  shouldForwardProp: (prop) =>
    typeof prop !== "string" ||
    !["color", "image", "hue", "brightness"].includes(prop),
})<CardHeaderBackgroundProps>`
  ${CommonHeaderBackground.styles};
  background-size: cover;
  ${({ color, image }) => {
    if (!color && !image) {
      return ""
    }
    let style = `background-image: `
    if (color) {
      style += `linear-gradient(to left, rgba(255, 0, 0, 0), ${color} 55%)`
    }
    if (image) {
      style += (color ? ", " : "") + `url(${image})`
    }
    return style
  }}
`
//   /*filter: hue-rotate(${props.hue ?? 0}deg)
// brightness(${props.brightness} ?? 1});*/

CardHeaderBackground.defaultProps = {
  "aria-hidden": true,
}

export const CardImageHeaderBackground = styled(Image, {
  shouldForwardProp: (prop) =>
    typeof prop !== "string" || !["color", "hue", "brightness"].includes(prop),
})<Omit<CardHeaderBackgroundProps, "image">>`
  ${CommonHeaderBackground.styles};
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${({ color }) =>
    color
      ? `background-image: linear-gradient(to left, rgba(255, 0, 0, 0), ${color} 55%)`
      : ""}
`

CardImageHeaderBackground.defaultProps = {
  "aria-hidden": true,
}

export const CardHeaderBackgroundSkeleton = styled("span")`
  ${CommonHeaderBackground.styles};
  background-color: #aaa;
`
