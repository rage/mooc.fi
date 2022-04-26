import styled from "@emotion/styled"

import Explanation from "./Explanation"

const ExplanationRoot = styled.section`
  display: flex;
  position: relative;
  margin-bottom: 2rem;
  height: 80%;
`

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`

function ExplanationHero() {
  return (
    <ExplanationRoot>
      <Explanation />
      <picture>
        <source
          srcSet={require(`../../static/images/homeBackground.jpg?webp`)}
          type="image/webp"
        />
        <source
          srcSet={require("../../static/images/homeBackground.jpg")}
          type="image/jpeg"
        />
        <BackgroundImage
          src={require("../../static/images/homeBackground.jpg")}
          alt=""
        />
      </picture>
    </ExplanationRoot>
  )
}

export default ExplanationHero
