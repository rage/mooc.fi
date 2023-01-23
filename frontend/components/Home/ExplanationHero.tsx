import { styled } from "@mui/material/styles"

import Explanation from "./Explanation"
import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"

const ExplanationRoot = styled("section")`
  display: flex;
  position: relative;
  margin-bottom: 2rem;
  height: 80%;
`

function ExplanationHero() {
  return (
    <ExplanationRoot>
      <Explanation />
      <BackgroundImage
        src="/images/homeBackground.webp"
        alt=""
        aria-hidden={true}
        fill
      />
    </ExplanationRoot>
  )
}

export default ExplanationHero
