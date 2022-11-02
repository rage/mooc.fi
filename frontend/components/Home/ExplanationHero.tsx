import styled from "@emotion/styled"

import Explanation from "./Explanation"
import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"

const ExplanationRoot = styled.section`
  display: flex;
  position: relative;
  margin-bottom: 2rem;
  height: 80%;
`

/*const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`*/

function ExplanationHero() {
  return (
    <ExplanationRoot>
      <Explanation />
      <BackgroundImage
        src="/static/images/homeBackground.jpg"
        alt=""
        aria-hidden={true}
        fill
      />
    </ExplanationRoot>
  )
}

export default ExplanationHero
