import { BackgroundImage } from "/components/Images/GraphicBackground"

import styled from "@emotion/styled"

interface RootProps {
  backgroundColor: string
}

const Background = styled.div<RootProps>`
  margin-top: 1em;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  margin-bottom: 5em;
  padding-bottom: 4em;
  position: relative;
  ${(props) =>
    `background-image: linear-gradient(to left, rgba(255,0,0,0) ,${props.backgroundColor} 55%);`}
  @media(max-width: 1200px) {
    ${(props) =>
      `background-image: linear-gradient(to top, rgba(255,0,0,0) ,${props.backgroundColor} 55%);`}
  }
`
interface DisplayBackgroundProps {
  backgroundColor: string
  children: any
  hueRotateAngle: number
  brightness: number
}
const ModuleDisplayBackground = (props: DisplayBackgroundProps) => {
  const { backgroundColor, children, hueRotateAngle, brightness } = props

  // webp for svg?
  // const imageUrl = "/static/images/backgroundPattern.svg"
  // <source srcSet={`${imageUrl}?webp`} type="image/webp" />

  return (
    <Background backgroundColor={backgroundColor}>
      <picture style={{ zIndex: -1 }}>
        <source
          srcSet={require("../../../static/images/backgroundPattern.svg")}
          type="image/svg+xml"
        />
        <BackgroundImage
          src={require("../../../static/images/backgroundPattern.svg")}
          aria-hidden
          hueRotateAngle={hueRotateAngle}
          brightness={brightness}
        />
      </picture>
      {children}
    </Background>
  )
}

export default ModuleDisplayBackground
