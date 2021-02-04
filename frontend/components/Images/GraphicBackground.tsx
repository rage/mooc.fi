import styled from "@emotion/styled"

interface BackgroundProps {
  hueRotateAngle: number
  brightness: number
}
export const BackgroundImage = styled.img<BackgroundProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  ${(props) =>
    `filter: hue-rotate(${props.hueRotateAngle}deg) brightness(${props.brightness});`}
`
