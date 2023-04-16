import { styled } from "@mui/material/styles"

import Explanation from "./Explanation"
import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"
import homeBackground from "/public/images/hero/homeBackground.webp"

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
        src={homeBackground}
        alt=""
        placeholder="blur"
        priority
        aria-hidden={true}
        fill
      />
    </ExplanationRoot>
  )
}

export default ExplanationHero
