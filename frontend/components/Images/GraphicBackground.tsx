import { styled } from "@mui/material/styles"

interface BackgroundProps {
  src: any
  hueRotateAngle: number
  brightness: number
}

export const BackgroundImage = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "hueRotateAngle" && prop !== "brightness",
})<BackgroundProps>`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  object-fit: cover;
  background-image: url(${(props) => props.src});

  ${(props) =>
    `filter: hue-rotate(${props.hueRotateAngle}deg) brightness(${props.brightness});`}
`
