import { styled } from "@mui/material/styles"

import { BackgroundImage } from "/components/Images/GraphicBackground"
import backgroundPattern from "/public/images/background/backgroundPattern.svg"

interface RootProps {
  backgroundColor: string
}

const Background = styled("div", {
  shouldForwardProp: (prop) => prop !== "backgroundColor",
})<RootProps>`
  margin-top: 1em;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  margin-bottom: 5em;
  padding-bottom: 4em;
  position: relative;
  ${(props) =>
    `background-image: linear-gradient(to left, rgba(255,0,0,0), ${props.backgroundColor} 55%);`}
  @media(max-width: 1200px) {
    ${(props) =>
      `background-image: linear-gradient(to top, rgba(255,0,0,0), ${props.backgroundColor} 55%);`}
  }
`
interface DisplayBackgroundProps {
  backgroundColor: string
  hueRotateAngle: number
  brightness: number
}

const ModuleDisplayBackground = (
  props: React.PropsWithChildren<DisplayBackgroundProps>,
) => {
  const { backgroundColor, children, hueRotateAngle, brightness } = props

  return (
    <Background backgroundColor={backgroundColor}>
      <BackgroundImage
        src={backgroundPattern.src}
        hueRotateAngle={hueRotateAngle}
        brightness={brightness}
        style={{ zIndex: -1 }}
      />
      {children}
    </Background>
  )
}

export default ModuleDisplayBackground
