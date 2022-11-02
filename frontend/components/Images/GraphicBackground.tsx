import Image from "next/image"

import { styled } from "@mui/material/styles"

interface BackgroundProps {
  hueRotateAngle: number
  brightness: number
}

export const BackgroundImage = styled(Image, {
  shouldForwardProp: (prop) =>
    prop !== "hueRotateAngle" && prop !== "brightness",
})<BackgroundProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  ${(props) =>
    `filter: hue-rotate(${props.hueRotateAngle}deg) brightness(${props.brightness});`}
`
